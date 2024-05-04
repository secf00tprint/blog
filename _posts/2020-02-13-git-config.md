---
layout: post
pageheader-image : /assets/img/post_backgrounds/home-matrix.png
image-base: /assets/img/git/config

title: Switching Git Configs
description: Don't leak your username and email
chapter: Don't leak your username and email

audience: [developer, tester, privacy advocates]
level: advanced
why:

categories: [testing, payloads, english]

permalink: /git/config/en

toc: true

---

Edit: 13.2.2021 - Added new solution with directories 

# Motivation

In git username and email address are required for each commit that is added.

Now it can happen that you have different roles for different repositories.
A common example is that you have a private account and a business one.
So for example on the one hand you commit open source and on the other hand
you produce proprietary software for a company. The open source code you want to make public under a pseudonym,
especially in the security world. At work, however, it is important that you push your real name and email.

# Problems

Now what you don't want is that things get merged like:

a) your company email and real name to be leaked in public repositories

<img src="{{ page.image-base | prepend:site.baseurl }}/github1t.png" alt="Github Name Exposure 1" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}/github2t.png" alt="Github Name Exposure 2" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}/git1t.png" alt="Git Name and Email Exposure" width="100%">

or

b) that professional customer projects will see your pseudonym rather than your real name in the commit history.

You know

a) can be used in different attacks like phishing against you.

b) is unprofessional, especially if the customer has access to the code.

# Global configuration

There are several ways to approach the topic.
The first option is to set a global configuration, e.g. for the pseudonym and then for all other repos locally.

First:

<pre><code class="bash">git config --global user.email "pseudonym@generaldomain.tld"
git config --global user.name "pseudonym"
</code></pre>

And then for every non-public project inside:

<pre><code class="bash">git config user.email "myname@company.tld"
git config user.name "Firstname Lastname"
</code></pre>

As a consequence, for each business repository, 2 extra steps are necessary, which cost time and money.
My experience shows that you quickly forget that in stress unfortunately and then the problems arise.

# Git hooks

Another option is to set git hooks.
These intervene before a commit and can change certain things at this moment.
However, they can only read the contact details, not change them and then commit in one step.
What is possible is that you could change it automatically, and exit with an error without committing, 
and would then have to do the commit again.
Or you can tell the user to change things manually (cf. [Stack Overflow](https://stackoverflow.com/questions/62190318/git-hook-to-set-username-and-email)).

# Root directories

Next possibility is to use a root directory for a specific git configuration. 
This you can define using the directive `includeIf` in your `~/.gitconfig`:

<pre><code class="bash">[user]
    name = pseudonym
    email = pseudonym@generaldomain.tld
    signingkey = 19AA78492C2E0E75929F2882826B365485623138 

...

[commit]
    gpgsign = true
[gpg]
    program = gpg
[includeIf "gitdir:~/work/"]
    path = ~/.gitconfig-work
</code></pre>

with `~/.gitconfig-work`:

<pre><code class="bash">[user]
email = myname@company.tld
signingkey = 19ACC26DFF642A36072626405B1D58B53F3F7A0E
</code></pre>

(cf [How to Use .gitconfig's includeIf](https://dzone.com/articles/how-to-use-gitconfigs-includeif))

However, you are then dependent on structuring git projects precisely according to these root directories. Which could be not always the case when you want to edit something quickly.

All mentioned ways weren't sufficient for me.

# My solution - an alias

One thing you can do is to be aware of which repository you are currently checking out.
Is it public or business? Depending on the repository, you can use an alias that automatically takes over the necessary configuration steps for you after checking out.
So you use a specific command for a business and a public repo.
You could use the standard global configuration `~/.gitconfig` for the public case:

<pre><code class="bash">git config --global user.email "pseudonym@generaldomain.tld"
git config --global user.name "pseudonym"
</code></pre>

and in the `~/.bashrc` or `~/.zshrc` you write:

<script src="https://gist.github.com/secf00tprint/3b7f36cd51d176b8b2b1e6b18f05ab02.js"></script>

For the code to run you need python on the system.

Now you're using `gcw business_repo` or `git clone public_repo` for public repos and your configuration is set correctly.

The only thing to remember is which command to use in which context. 
The solution avoids additional steps that you could forget and is still automatic.

PS Feedback welcome. You can give some comments [here](https://gist.github.com/secf00tprint/3b7f36cd51d176b8b2b1e6b18f05ab02)