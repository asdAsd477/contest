def longestPalindrome(self, s: str) -> str:
    res = ''

    for i in range(len(s)):
        for j in range(i, len(s)):
            substr = s[i:j+1]
            if substr == substr[::-1] and len(substr) > len(res):
                res = substr

    return res