---
slug: singularity sample
title: Singularity sample file
authors: barle
tags: [singularity, cuda, gpu]
---

# Singularity sample file for a simple CUDA application

Here's a simple starting file that's based on a CUDA 11 docker image for ubuntu 20.04.
It includes the `vectorAdd.cu` file from `NVIDIA_CUDA-11.X_Samples/0_Simple/vectorAdd` and the header files from `NVIDIA_CUDA-11.X_Samples/common/inc`, where `X` stands for the specific CUDA version installed. These sample files used to come with the CUDA toolkit, but they have to be downloaded from a [repo](https://github.com/NVIDIA/cuda-samples) now.


```
Bootstrap: docker
From: nvcr.io/nvidia/cuda:11.4.2-base-ubuntu20.04

%post
    export LC_ALL=C
    apt-get update
	echo "America/Argentina" > /etc/timezone
	apt install tzdata
    apt install -y cuda-command-line-tools-11-4 cuda-libraries-11-4 cuda-toolkit-11-4
	cd /opt/my_files/
    nvcc vectorAdd.cu -I inc/ -o vectorAdd
	
%environment
    export LC_ALL=C
    export PATH=/usr/local/nvidia/bin:$PATH
    export LD_LIBRARY_PATH=/usr/local/nvidia/lib:$LD_LIBRARY_PATH
    export $DEBIAN_FRONTEND=noninteractive

%runscript
	cd /opt/my_files
	./vectorAdd

%files
	vectorAdd.cu /opt/my_files/
	inc /opt/my_files/inc
```

Some explanations about the non-obvious lines:

1. `export LC_ALL=C`: so Perl doesn't complain about localization
2. `tzdata` is a cuda-toolkit dependency that asks for user interaction to set the timezone. We take extra precautions to prevent the installation process from hanging at this step by setting the timezone explicitely, forbidding user interaction with `export $DEBIAN_FRONTEND=noninteractive` and installing `tzdata` beforehand.

