---
slug: singularity_upload
title: Uploading the singularity container
authors: barle
tags: [singularity, containers, sylabs]
---

# Uploading the singularity container

This is probably the last of a series of blog posts on singularity.

We know how to build [a simple container with CUDA support](/blog/singularity_sample)
and we know how to build [a more complex one that also has conda support](/blog/singularity_upload).
We'll now sign our container (`locuaz.sif`) and upload it for others to download.
Honestly, this is the easiest part of all and I'm only writing it down for future reference.

## Intro (digression)

Before starting, we have to clarify something: 
[Singularity is no more](https://apptainer.org/news/community-announcement-20211130). 
In a weird turn of events, a company forked it and called it to Singularity CE,
while the original project had to rename itself to **Apptainer** and is now under the
umbrella of the Linux Software Foundation, which I guess protects it from
stuff like this happening again, but, honestly, I have no idea.

As of now, an HPC cluster can be expected to have a *singularity* module but
I haven't found one with *apptainer* built-in, so we'll stay with sylabs,
*at least for now*.

## The sylabs way

### Creating a key to sign containers

In order to sign something you need a signature and Singularity's docs are straightforward in this regard, just do [what they say](https://docs.sylabs.io/guides/latest/user-guide/signNverify.html#generating-and-managing-pgp-keys)

### Creating a sylabs token to verify containers

You'll also want the ability to verify a signature.
Creating an account on [sylabs](https://cloud.sylabs.io/) allows you to
verify containers from others and upload yours. Sadly, they don't let you
create an account, but force you to integrate their credentials with github,
or gmail, etc. 

## Signing and uploading with sylabs

After all of that, it's just:

```
singularity sign locuaz.sif
```

and to verify the signature, users will do:

```
$ singularity verify locuaz.sif 
INFO:    Verifying image with PGP key material
[LOCAL]   Signing entity: Patricio Barletta <pbarletta@gmail.com>
Objects verified:
ID  |GROUP   |LINK    |TYPE
------------------------------------------------
1   |1       |NONE    |Def.FILE
2   |1       |NONE    |JSON.Generic
3   |1       |NONE    |JSON.Generic
4   |1       |NONE    |FS
INFO:    Verified signature(s) from image 'locuaz.sif'
```

Finally, push it to your sylabs library. In my case, that looks like:
```
singularity push locuaz.sif library://pgbarletta/remote-builds/locuaz-0.5.3
```

Sylabs will give you 11Gb of storage for free, so you'll be good for a couple
of images. It'd be fun to try and see if an Apptainer image gets accepted, my
guess is a big resounding [...](https://en.meming.world/images/en/1/1d/Creating_Bugs_Bunny%27s_%22No%22.jpg).


## References

1. https://docs.sylabs.io/guides/latest/user-guide/signNverify.html
2. https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry