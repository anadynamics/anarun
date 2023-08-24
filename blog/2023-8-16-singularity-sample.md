---
slug: singularity_sample
title: Singularity sample file
authors: barle
tags: [singularity, cuda, gpu]
---

# Singularity sample file for simple CUDA development

Here's a simple starting file that's based on a CUDA 11 docker image for ubuntu 22.04.
It includes the `vectorAdd.cu` file from `cuda-samples/Samples/0_Introduction/vectorAdd` and some header files from `cuda-samples/Common`. These sample files used to come with the CUDA toolkit, but now they have to be downloaded from a [repo](https://github.com/NVIDIA/cuda-samples).

```
Bootstrap: docker
From: nvcr.io/nvidia/cuda:11.7.0-devel-ubuntu22.04

%post
	export DEBIAN_FRONTEND=noninteractive
    apt update
    cd /opt
    nvcc -ccbin g++ -m64 -gencode arch=compute_50,code=sm_50 -gencode arch=compute_52,code=sm_52 -gencode arch=compute_60,code=sm_60 -gencode arch=compute_61,code=sm_61 -gencode arch=compute_70,code=sm_70 -gencode arch=compute_75,code=sm_75 -gencode arch=compute_80,code=sm_80 -gencode arch=compute_86,code=sm_86 vectorAdd.cu -o local_vectorAdd -I./
    
%runscript
    /opt/local_vectorAdd

%environment
    export LC_ALL=C

%files
    helper_cuda.h /opt/
	helper_string.h /opt/
	vectorAdd.cu /opt/
```

Some explanations about the non-obvious lines:

1. `export DEBIAN_FRONTEND=noninteractive` is an almost mandatory line in all containers.
It prevents the system from expecting user input, which in our case would hald the container build.
2. `export LC_ALL=C`: so Perl doesn't complain about localization if we launch the container as a shell.
3. We're asking `nvcc` to generate PTX and SASS for all currently supported architectures.

After saving this into the definition file `singu.def` and building it on my machine:
```
$ sudo singularity build singu.sif singu.def
```

I uploaded it onto [Leonardo](https://leonardo-supercomputer.cineca.eu/), which is a Red Hat 8.6 system, and ran it:

```
(base) [pbarlett@lrdn3433 ~]$ singularity run --nv singu.sif 
INFO:    Converting SIF file to temporary sandbox...
WARNING: underlay of /etc/localtime required more than 50 (76) bind mounts
WARNING: underlay of /usr/bin/nvidia-smi required more than 50 (387) bind mounts
[Vector addition of 50000 elements]
Copy input data from the host memory to the CUDA device
CUDA kernel launch with 196 blocks of 256 threads
Copy output data from the CUDA device to the host memory
Test PASSED
Done
INFO:    Cleaning up image...
```

GLIBC versions between my computer (2.35) and Leonardo's (2.28) also differ, so we can only hope we don't run into any issues later on.
