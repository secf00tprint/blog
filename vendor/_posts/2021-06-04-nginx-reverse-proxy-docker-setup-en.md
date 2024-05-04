---
layout: post
pageheader-image : /assets/img/post_backgrounds/home-matrix.png
image-base: /assets/img/devops/docker/nginx

title: Reverse Proxy Nginx Docker Template
description: Short description on how to set up a reverse proxy using docker

audience: [operations-interested people]
level: beginner
why: if somebody finds it useful

categories: [docker, nginx, reverse-proxy, proxy, english, notoc]

permalink: /devops/docker/nginx/reverseproxy/en

---

I was looking for a simple and short tutorial on how to set up a reverse proxy using docker that I could use as a basis for other topics.
Since the internet has nothing that satisfied me, I decided to write my own stuff in hope that others can benefit from it.

So this is the result. The accompanying repo can be found [here](https://github.com/secf00tprint/simple-reverse-proxy).

The reverse proxy used here is structured as following:

- Docker as a container
- Nginx as server reachable from outside
- Python3 simple HTTP Server as a server used inside

The repo contains the following files:

<pre><code class="bash">tree
.
├── conf
│   └── default.conf (nginx configuration)
├── Dockerfile 
├── README.md 
└── scripts
    └── docker-entrypoint.sh (is starting everything when docker is started)
</code></pre>

To run it do:

<pre><code class="bash">sudo docker build -t simple-reverse-proxy . && sudo docker run -ti -p 127.0.0.1:3333:80 simple-reverse-proxy
</code></pre>

After that, the internal server can be reached from your host using the reverse proxy at <a href="http://127.0.0.1:3333">http://127.0.0.1:3333</a>.

The content goes this way: 

<pre><code>http://127.0.0.1:8000 (internal server inside docker) -> 
http://0.0.0.0:80 (proxy server inside docker) -> 
http://127.0.0.1:3333 (final server listening on host)
</code></pre>

The server listens on your host at http://127.0.0.1:3333 because of the port forwarding 

<pre><code>-p 127.0.0.1:3333:80 
</code></pre>

used in the docker command.

The web root is set in the Dockerfile

<pre><code class="bash">grep mkdir Dockerfile 
RUN mkdir -p /var/www/html
</code></pre>

For the internal server I took the simple http server that python gives you. 

<pre><code class="bash">python3 -m http.server
</code></pre>

<pre><code class="bash">grep python3 scripts/docker-entrypoint.sh
python3 -m http.server
</code></pre>

but this could be any other web server as well.

Python's server uses the folder where it is started, so the docker working directory is set to the web root
and when you run the container the server will be invoked in /var/www/html:

<pre><code class="bash">grep WORKDIR Dockerfile                  
WORKDIR /var/www/html
</code></pre>

If you want to use another web server assure yourself that it delivers its content from here or change it in the Dockerfile.

The connection between internal and proxy server is done inside the nginx config file default.conf:

<pre><code class="bash">cat conf/default.conf
server {
 listen 80;
 location / {
   proxy_pass http://127.0.0.1:8000;
  }
}
</code></pre>

Python's server module defaults to port 8000.

You can change these configurations points depending on what internal root server you want to use.


