#include <iostream>

auto fibo(int val) -> int
{
    if (val == 0) return 0;
    if (val == 1) return 1;
    return fibo(val-1) + fibo(val-2);
}

int main() {

    const int val = fibo(38);
    std:: cout << val << std::endl; 
}

