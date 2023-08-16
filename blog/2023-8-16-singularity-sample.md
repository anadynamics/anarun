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
	cd /opt/my_files/
	
%environment
    export LC_ALL=C
    export PATH=/usr/local/nvidia/bin:$PATH
    export LD_LIBRARY_PATH=/usr/local/nvidia/lib:$LD_LIBRARY_PATH
    export $DEBIAN_FRONTEND=noninteractive

%runscript
	cd /opt/my_files
	./vectorAdd

%files
	vectorAdd
```

Some explanations about the non-obvious lines:

1. `export LC_ALL=C`: so Perl doesn't complain about localization
2. `tzdata` is a cuda-toolkit dependency that asks for user interaction to set the timezone. We take extra precautions to prevent the installation process from hanging at this step by setting the timezone explicitely, forbidding user interaction with `export $DEBIAN_FRONTEND=noninteractive` and installing `tzdata` beforehand.

```
Bootstrap: docker
From: ubuntu:20.04

%post
    export LC_ALL=C
	export CUDA_DIR=/usr/local/cuda-11.1
    export PATH=/usr/local/nvidia/bin:$PATH
    export LD_LIBRARY_PATH=/usr/local/nvidia/lib:$LD_LIBRARY_PATH
    export DEBIAN_FRONTEND=noninteractive
    apt-get update
	apt-get install -y software-properties-common 
    apt-get update
	echo "America/Argentina" > /etc/timezone
	apt install -y tzdata wget

	wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64/cuda-ubuntu2004.pin
	mv cuda-ubuntu2004.pin /etc/apt/preferences.d/cuda-repository-pin-600
	wget https://developer.download.nvidia.com/compute/cuda/12.2.1/local_installers/cuda-repo-ubuntu2004-12-2-local_12.2.1-535.86.10-1_amd64.deb
	dpkg -i cuda-repo-ubuntu2004-12-2-local_12.2.1-535.86.10-1_amd64.deb
	cp /var/cuda-repo-ubuntu2004-12-2-local/cuda-*-keyring.gpg /usr/share/keyrings/
	apt-get update
	apt-get -y install cuda

	cd /opt/my_files/
	
%environment
    export LC_ALL=C
    export PATH=/usr/local/cuda/bin:$PATH
    export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH

%runscript
	cd /opt/my_files
	./vectorAdd

%files
	vectorAdd.cu /opt/my_files/
	inc /opt/my_files/inc
```
