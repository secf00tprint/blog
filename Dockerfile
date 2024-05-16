FROM ruby:2.7.4

RUN useradd -ms /bin/bash ruby
RUN gem install jekyll -v 4.3.3
RUN gem install 'jekyll-toc'
RUN gem install 'jekyll-target-blank'
RUN gem install 'jekyll-sitemap'
USER ruby
RUN mkdir /home/ruby/blog
RUN cd /home/ruby/blog; 
WORKDIR /home/ruby/blog
