---
slug: typeof
title: typeof() for C++
authors: barle
tags: [C++, c++, C, c]
---

# typeof() alike for C++

While C++ programmers are used to its poor ergonomics, getting the type of a variable in C++ is a surprisingly convoluted process.

<!--truncate-->

Luckily, we don't often find ourselves in need of guessing a type, but when we do, we are up against one of the original basic traits of C++,
its mangling of identifiers, that is, the names of functions and types.

During its first steps, C++ was just an abstraction layer over C. But, unlike C, C++ allows function overload,
so functions could share names as long as they don't share signature (the types of its input parameters).
C++ also allows templates so fundamentally different types could have, on a surface level, the same name. 

Bjarne Stroustrup wrote a C++ to C compiler and then made use of available C compilers for the final translation to machine code.
So Bjarne had to use the available C linkers at the time, which understood functions and types as symbols and the only identifier
for a symbol was its name, which was fine for C, but not for C++. Hence, name mangling.
To this day C++ will modify the name of all its types and functions in a platform dependent way (C++ standard allows this),
so the linker doesn't think there was a redefinition error.

The implication of all of this is that even if we are able to check the type of our variables, that type would look
like gibberish for us since, as you can imagine, automatic machine mangling does not look nice.
And to make things worse, the mangler is not unique to C++, so same types will get different mangled names in different platforms.

To deal with all of this we're going to need 2 libraries, a standard one (`typeinfo`) to get our types,
and one from boost to demangle them (`boost/core/demangle.hpp`). You can check this [godbolt](https://godbolt.org/#z:OYLghAFBqd5QCxAYwPYBMCmBRdBLAF1QCcAaPECAMzwBtMA7AQwFtMQByARg9KtQYEAysib0QXACx8BBAKoBnTAAUAHpwAMvAFYTStJg1DIApACYAQuYukl9ZATwDKjdAGFUtAK4sGEs6SuADJ4DJgAcj4ARpjEegAOqAqETgwe3r7%2BpInJjgIhYZEsMXFctpj2eQxCBEzEBOk%2BflwBdpgOqTV1BAUR0bF6CrX1jZkttsM9oX3FA1wAlLaoXsTI7BzmAMyhyN5YANQmm24Abu1ExEfYJhoAgls7e5iHx1QsBAD0aMSYAHQIVxu9zM2wYuy8ByObgIAE94phQvxAXcHmCni83FFUElPt9MB8sCxDMB6P94vFkfcUXddkwFAp9gBZGEAFThzxMAHYrHd9nz%2BaECPs8Ecebc%2BVyACKioESu4ETAseIGBUY2Hw5hsfYsq77Wn0pmsxXKpgK9Bs%2BGHbmy/ks4UylGc6WbMVAwX7ImhCDzK1i/n7Ki0VCmgMvSX7ABsvw0IKoDvF/LeBBAIHixEFEHMZkDweThwArG4GCZCwQuVYnSWiwBaWtV4tmAL7LE4lN4lOE4n0CDqhHoajzX6azDe%2BbzeM2vlDdAps4OEhQnOm3UnLjluOVl2TgPvFNpjNZucXfaoKgBoOmhQgAtFqtl62VwsMWvV%2BtZ0jN7FDNskdggTtGN2vZ4P2q6DsOo7jlu1IJlOBAziAR4LscLa0CuZjxv6SZ7umgiZo2SHECeZ6odeb6luWUr1i%2Bb6Nh%2BLbfigv4doqXYjsBoFmOBrAjmOUGury/LMhazwnHUa7QbBO7JqmuEEPhZjCeyZFPnelGPjWdaqXRn6tkxPwsUSgHseyIEQGJxALEOPGQROgl8sJxoqpg5rslCgornUGGSVhu6yQejaOUqzmufCKm3hRD7Sk%2BNHaU2DEye2/6scZPamaBXncWwtmSduPwECsDD7BoE5Ohwiy0Jw%2Ba8H4HBaKQqCcG41jWPsCjLKsHIgjwpDJnV5WLAA1iA%2BYaPonCSDVmi8I1HC8FeY19VoixwLAMCIExSp0LE5CUGgW30HEwAKMw8QKAgqAEHwdAKsQV4QFE02kFEoR1DCT37WwggAPIMLQ739aQAEkus9X4D8HRnFegOYKo7ReAqT2ChUT20HgUTEG9HhYJwPUEOmLC4%2BVfAGMdABqeCYAA7t9GpEzIggiGI7BSAz8hKGoT26GUBhGCgLWWPo6NXrAw4gAlpBnHE3CcpyxMQGLSaSwMHCclwmwDQ18RVND1bfWY%2BzVtORySqYljWGY9VtB0zgQK4ozNIEDDoL0RQlAkSQpAIDse7kqSu/0pTlJUnSTD7ZTW1UXT1AHsxB0M3ThxM3Sx%2B7CxLCsax6PjmDrDwFVVVNgOzaoAAcEbVhGkj7MAyDIPsPbEF4DCDT6EDNebgv7LghAkIc3Ufh4B2xP3mwLLwS2a8No3jRwk2kITM%2B1fVs3zSAi3TSt60QEgywEPECO7RA%2B3xNtQcub3Qf8IzojiKz1/syo6iA1TmPxETBccNVpDLzNnDfQjA%2BQpTz7DLhXKuNc64N3xs3VuDch6n0OqPcevVN6LAQJgJgWA4jelnvPReY1f4NU4GvDe/UxykGnmNSqHANY/yeqvVB5DP5mCLivEhTDlqLClskZwkggA%3D) to see the end result.

Finally, I've also retrieved the necessary boost headers to get this same functionality in my projects without the need of installing boost,
which would be overkill for our needs. [Here's](https://github.com/pgbarletta/cpp_typeof) the github repo with the `typeof` header-only library.
It's based on boost's license since it's basically a very small collection of boost headers + 1 header (`typeof.hpp`) with a convenience function.
I've also added a `CMakeLists.txt` so you can add it to your project just by adding the folder into you project's folder and these 2 lines in your main `CMakeLists.txt`:

```
add_subdirectory(include/typeof)
target_link_libraries(sample TYPEOF)
```

If you clone the repo you'll see how it all works.

##### addendum

Shortly after doing all of this, I found [nameof](https://github.com/Neargye/nameof) which does the same thing and more, and is also header-only, so it's a better solution in every aspect.
