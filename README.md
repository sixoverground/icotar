<div style="display: flex; align-items: center;">
    <img src="https://icotar.com/avatar/icotar" width="64" height="64" style="margin-right: 1em; border-radius: 50%;">
    <span style="font-size: 32px;">Icotar</span>
</div>

---

#### Colorful Icon Avatars

![ba8s2zi2564zywrz](https://icotar.com/avatar/ba8s2zi2564zywrz.png?s=40 "ba8s2zi2564zywrz")
![jmuha06nxn93tiyu](https://icotar.com/avatar/jmuha06nxn93tiyu.png?s=40 "jmuha06nxn93tiyu")
![52occ56yj5nyxg8s](https://icotar.com/avatar/52occ56yj5nyxg8s.png?s=40 "52occ56yj5nyxg8s")
![3rvoz9t3v1m15r6a](https://icotar.com/avatar/3rvoz9t3v1m15r6a.png?s=40 "3rvoz9t3v1m15r6a")
![9f85j5ah3mlwiq0c](https://icotar.com/avatar/9f85j5ah3mlwiq0c.png?s=40 "9f85j5ah3mlwiq0c")
![hndtrxlnd1c47zl6](https://icotar.com/avatar/hndtrxlnd1c47zl6.png?s=40 "hndtrxlnd1c47zl6")
![pfqrcjfiojbsalf4](https://icotar.com/avatar/pfqrcjfiojbsalf4.png?s=40 "pfqrcjfiojbsalf4")
![wcy3825im6a5oibn](https://icotar.com/avatar/wcy3825im6a5oibn.png?s=40 "wcy3825im6a5oibn")
![uucs7oanalvd4lpb](https://icotar.com/avatar/uucs7oanalvd4lpb.png?s=40 "uucs7oanalvd4lpb")
![q4pq5sbm13yy0yx9](https://icotar.com/avatar/q4pq5sbm13yy0yx9.png?s=40 "q4pq5sbm13yy0yx9")

Icotar generates simple, playful avatars for your app or website. Based on the lovable avatars from Yik Yak, each avatar consists of a colorful background and a recognizable symbol. All colors and icons are hand-picked from [Material Design](https://material.io/).

Setting up Icotars is easy with a simple and free HTTP API that you can use without an account!

## How to Use Icotar
Icotar images may be requested just like a normal image. Our HTTP-API is based on the system built by the fine folks at Gravatar.

#### Base Request
The most basic image request URL looks like this:
```
https://icotar.com/avatar/:hash
```
Where `:hash` is replaced with anything you like. But **don't** use any sensitive or personal data here! For example, here is a base URL:
```
https://icotar.com/avatar/craig
```
<img src="https://icotar.com/avatar/craig" width="80" height="80" alt="craig" title="craig">

#### File Types
All avatars are served as SVG files by default. If you require a **file-type extension** then you can add an optional `.svg` extension to that URL:
```
https://icotar.com/avatar/craig.svg
```
Icotar also supports PNG files:
```
https://icotar.com/avatar/craig.png
```

#### Size
By default, PNG images are presented at 80px by 80px if no size parameter is supplied. You may request a specific image size, which will be dynamically delivered from Icotar by using the `s=` or `size=` parameter and passing a single pizel dimension (since Icotars are square):
```
https://icotar.com/avatar/craig.png?s=200
```
![craig](https://icotar.com/avatar/craig.png?s=20 "craig")
![craig](https://icotar.com/avatar/craig.png?s=80 "craig")
![craig](https://icotar.com/avatar/craig.png?s=150 "craig")

You may request images anywhere from **1px up to 1024px**.

#### Secure Requests
All URL requests should start with HTTPS.

## License

[MIT License](https://opensource.org/licenses/MIT)

Made with ❤️ by [Six Overground](http://sixoverground.com)