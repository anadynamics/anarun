#include <iostream>

template<int I> struct Fib
{
    static int const val = Fib<I-1>::val + Fib<I-2>::val;
};

template<> struct Fib<0>
{
    static int const val = 0;
};

template<> struct Fib<1>
{
    static int const val = 1;
};

int main() {

    Fib<38> fibo;
    std::cout << fibo.val << std::endl; 
}

