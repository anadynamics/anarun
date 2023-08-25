---
slug: singularity_conda
title: Singularity + CUDA + conda
authors: barle
tags: [singularity, cuda, gpu, conda, mamba, mambaforge]
---

# Singularity + CUDA + conda

In the [previous post](/blog/singularity_sample) we reviewed a simple Singularity definition file for a container that gave support for CUDA development.

We'll now see an example that uses the CUDA toolkit runtime and a *conda* environment, or more precisely, mambaforge which includes `mamba` as a conda replacement and `conda-forge` as the default channel. 

*mamba* works almost identically to *conda* and it's an order of magnitude faster. I think many of us would've dropped *conda* as a package manager and virtual environment if it wasn't for *mamba*'s solver.

## Writing the definition file

This is the Singularity definition file I used to containerize the [locuaz](https://locuaz.readthedocs.io/en/latest/) optimization protocol. We'll skip the details about *locuaz*, suffice to say that it's an antibody optimization protocol that carries a lot of dependencies, some of them cannot be installed through `pip`, others cannot be installed through `conda` so we end up using both, which is not ideal.
This is precisely why I think trying to containerize it is a good challenge.

Let's check the `.def` definition file:
```
Bootstrap: docker
From: nvcr.io/nvidia/cuda:11.7.0-runtime-ubuntu22.04

%post
    export LC_ALL=C
    export DEBIAN_FRONTEND=noninteractive
    apt update
    apt install -y wget libopenmpi-dev
    mkdir /opt/concept
    cd /opt/concept
    mv ../usr_deps.yaml ./
    wget https://github.com/conda-forge/miniforge/releases/download/23.3.1-0/Mambaforge-23.3.1-0-Linux-x86_64.sh
    bash Mambaforge-23.3.1-0-Linux-x86_64.sh -p /opt/mambaforge  -b 
    . /opt/mambaforge/bin/activate 
    mamba env create -f usr_deps.yaml
    conda activate concept
    pip install locuaz --root-user-action=ignore
    
%runscript
    locuaz
 
%environment
    export LC_ALL=C
    source /opt/mambaforge/bin/activate /opt/mambaforge/envs/concept
    
%files
    usr_deps.yaml opt/
```

Some explanations about the non-obvious lines:

1. We install `wget` to download the *mambaforge* installer script and `libopenmpi-dev`
since *locuaz* uses MPI to launch multiple GROMACS MD runs.
2. We run the *mambaforge* installer with the `-b` flag to skip the license agreement
question and `-p` to specify the install dir.
3. `. /opt/mambaforge/bin/activate ` to activate conda and then use the `mamba` executable to build the environment. The yaml file was included with the container.
4. And after creating and activating the environment, we install *locuaz* with a flag
that was added to `pip` for the specific case of containerized builds, where we usually
are the *root* user: `--root-user-action=ignore`, to silence the `pip` warning coming from installing with *root* privileges

Now, the major pain point when including `mambaforge` is the activation of the environment. 

You can't run `source /root/.bashrc` after installing *mambaforge* since `source` is note available during the execution of `%post`.
You can't run `conda init` or `mamba init` either, since it'll ask you to restart your shell.

The solution is to run the activation script in a way any UNIX system should support, that is, using the syntax: `. script`. Then on `%environment` we get a full bash interpreter and we can source the activation script and point it to the folder where our environment resides: `source /opt/mambaforge/bin/activate /opt/mambaforge/envs/<your_environment>`.

Finally, we build it:
```
sudo singularity build locuaz.sif locuaz.def
```

## Actually running it

There's another obstacle when running from a container, and this is the binding of host directories. Singularity includes some host dirs by default, but if your containerized workflow needs additionl access, you'll need to include it with the [`--bind` flag](https://docs.sylabs.io/guides/3.0/user-guide/bind_paths_and_mounts.html?highlight=bind).

In our case, it's GROMACS that needs many additional locations. This is how the singularity call command ends up looking looks on my machine:

```
singularity exec --nv --bind /usr/local/gromacs,/lib/x86_64-linux-gnu,/usr/local/cuda-12.2/lib64,/etc/alternatives locuaz.sif locuaz daux/config_ligand.yaml 
```

Notice the `--nv` flag to be able to run with GPU support and how we include a plethora of comma separated directories, after the `--bind` flag. After `locuaz.sif`, our actual container, we call the `locuaz` program with a configuration file as argument.

The `/usr/local/gromacs` directory is where the GROMACS installations resides. The rest of the directories are the locations of the libraries that the `gmx` binary links to. These will be specific to each machine, but you'll easily find them by checking which libraries does the `gmx` binary link to.

For example, on my machine:
```
ldd `which gmx`
        linux-vdso.so.1 (0x00007ffc8817a000)
        libgromacs.so.8 => /usr/local/gromacs/lib/libgromacs.so.8 (0x00007f74c0200000)
        libstdc++.so.6 => /lib/x86_64-linux-gnu/libstdc++.so.6 (0x00007f74bfe00000)
        libgcc_s.so.1 => /lib/x86_64-linux-gnu/libgcc_s.so.1 (0x00007f74c5417000)
        libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f74bfa00000)
        libcufft.so.11 => /usr/local/cuda-12.2/lib64/libcufft.so.11 (0x00007f74b4c00000)
        libopenblas.so.0 => /lib/x86_64-linux-gnu/libopenblas.so.0 (0x00007f74b27b0000)
        libm.so.6 => /lib/x86_64-linux-gnu/libm.so.6 (0x00007f74c532e000)
        libgomp.so.1 => /lib/x86_64-linux-gnu/libgomp.so.1 (0x00007f74c52da000)
        libmuparser.so.2 => /usr/local/gromacs/lib/libmuparser.so.2 (0x00007f74c017d000)
        /lib64/ld-linux-x86-64.so.2 (0x00007f74c5471000)
        libdl.so.2 => /lib/x86_64-linux-gnu/libdl.so.2 (0x00007f74c52d5000)
        libpthread.so.0 => /lib/x86_64-linux-gnu/libpthread.so.0 (0x00007f74c52d0000)
        librt.so.1 => /lib/x86_64-linux-gnu/librt.so.1 (0x00007f74c0178000)
        libgfortran.so.5 => /lib/x86_64-linux-gnu/libgfortran.so.5 (0x00007f74b2400000)
```

If you wish to make the run line shorter, you can store these locations on the dedicated environment variable `$SINGULARITY_BIND`:
```
export SINGULARITY_BIND="/usr/local/gromacs,/lib/x86_64-linux-gnu,/usr/local/cuda-12.2/lib64,/etc/alternatives/"
```
And then just run:
```
singularity exec --nv locuaz.sif locuaz daux/config_ligand.yaml
```

This does make everything a bit uglier for the user and I'd argue that creating a conda environment and running pip is not that much harder, but hey, some people love containers.

Hopefully in the future I'll get to benchmark the containerized version of the protocol, but I don't expect significative slowdowns.