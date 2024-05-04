---
layout: post
pageheader-image : /assets/img/post_backgrounds/Hacking_password_illustration_blured.jpg
image-base: /assets/img/passwords/crunch/

title: Crunch Wordlist Generator - Create Single Characters
description: Using crunch to create single characters

audience: [security-interested people]
level: intermediate
why: improves security skills

categories: [security, password, generator, english, wordlist, notoc]

permalink: /passwords/crunch/advanced/en

toc: false

---

Preface: This text is based on the answer from [Kamil Maciorowski](https://superuser.com/users/432690/kamil-maciorowski) in [Stack Exchange](https://superuser.com/questions/1465287/crunch-d-option-with-simple-aa-charset), who provides a deeper understanding through practical examples at this point.
Many thanks for this.

<br>

You need access to a system but you don't have the password for it. One way to get into it is trying to crack the password. 
If you don't know exactly the login you can try to brute force it using a word list.
The generator [crunch](https://tools.kali.org/password-attacks/crunch) can be used to create such word lists.

It is advisable to create a word list with the most likely hits so that the time to solve it is as short as possible.
The starting point for limiting a list is knowledge about the target.

In the case of your own password, for example:

- What did it look like?

In case of an attack on another account this could be:

- Are there established password rules? 
- Social Engineering methods like shoulder surfing
- Are there any other known passwords?

Password rules often can be determined by creating an account and entering some wrong passwords.
Shoulder surfing can happen if the attacker watches someone type in the credentials. 
Information most easily inferred is often how many characters were entered and sometimes specific characters observed from keyboard.
Other social engineering methods are [extracting information using communication (elicitation)](https://www.social-engineer.org/framework/influencing-others/elicitation/) or [collecting and analyzing areas of interest (osint)](https://en.wikipedia.org/wiki/Open-source_intelligence).

For example:

If you know that the password you are looking for contains of

- 4 to 6 characters and consists of lower case letters

<pre><code class="bash">crunch 4 6
</code></pre>

generates these variants. However, this is very unspecific.

But you can also use the tool if you want to search for something more specifically.

Example:

- You know or suspect part of the password, but you do not know the rest.

Suppose the known part of the password is "abracadabra". It is also known that it

- starts with that word and 
- must contain lower-case, upper-case, numbers and special characters.
- It is known from shoulder surfing that it has to be 12 characters long, since 12 keys were pressed when typing and appeared on the display as black dots.

The corresponding word list can then be created using the following command:

<pre><code class="bash">crunch 12 12 -f "/usr/share/crunch/charset.lst" mixalpha-numeric-all -t abracadabra@
</code></pre>

<img src = "{{page.image-base | prepend: site.baseurl}}charset_file_1.png" width = "100%" alt = "charset file 1">

How does this command come about?

crunch offers 4 sets that can be used in the command. These sets can then be mapped onto letters.
The corresponding symbols are: `@`, `,`, `%` and `^`.
You define them by entering character sets in the command line in exactly this order.

<pre><code class="bash">crunch minimun-char maximum-char set-definition other-instructions
</code></pre>

In the command above, the set definition is:

<pre><code class="bash">-f "/usr/share/crunch/charset.lst" mixalpha-numeric-all 
</code></pre>

In this way, the first set `@` is assigned the definition `mixalpha-numeric-all` from `/usr/share/crunch/charset.lst`.

If you want to use the second set you can do it as follows -
let's say it is known that the

- first character of the password is a number:

<pre><code class="bash">crunch 13 13 -f "/usr/share/crunch/charset.lst" mixalpha-numeric-all numeric -t ,abracadabra@
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}charset_file_2.png" width="100%" alt="charset file 2">

This you can do for up to the first 3 sets (at least that's my experience, if anyone knows more please let me know. I look forward to any feedback):

<pre><code class="bash">crunch 13 13 -f "/usr/share/crunch/charset.lst" mixalpha-numeric-all numeric symbols14 -t ,abrac%dabra@
</code></pre>

If you don't want to use the defaults from the file, you can set your own. And here you can use all 4 sets:

<pre><code class="bash">crunch 13 13 xyz + 123 ! -t %abrac^dabra@
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}specific_charsets.png" width="100%" alt="specific charsets">

In this command

<pre><code class="bash">xyz + 123 ! 
</code></pre>

sets the individual symbols.

This breaks down as follows:

If you don't want to specify a set, you can do so with `+`, then crunch takes a respective default set for the corresponding symbol.
These are 

- for `@` lowercase, 
- for `,` uppercase, 
- for `%` numbers and 
- for `^` special characters.
