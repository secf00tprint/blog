```
sudo docker build -t blog .
sudo docker run -ti -v `pwd`/blog:/home/ruby/blog -p 127.0.0.1:4000:4000 blog /bin/bash
add host: 0.0.0.0 to your _config.yml
bundle add webrick
JEKYLL_ENV=production jekyll serve
```
