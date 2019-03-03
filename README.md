# ucstage-web

ssh-keygen -t rsa -b 2048 -C “your_email@example.com” 
其中，your_email@example.com要修改成你的邮箱地址。 
回车后输出如下： 
Generating public/private rsa key pair. 
Enter file in which to save the key (/home/xxx/.ssh/id_rsa): 
其中，xxx是你的用户名，直接回车，会将key保存到默认文件中。 
接着会输出： 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
这两步是让你输入一个密码，以及确认密码，这个密码在你提交代码到Github时会用到【注意：记住这个密码，最简单的方式就是设置的和github账户登入密码一样，容易记住】 
回车后就提示成功了： 
Your identification has been saved in /home/xxx/.ssh/id_rsa. 
Your public key has been saved in /home/xxx/.ssh/id_rsa.pub. 
The key fingerprint is: 
01:0f:f4:3b:ca:85:d6:17:a1:7d:f0:68:9d:f0:a2:db your_email@example.com 
到这一步，你会发现 ~/.ssh/id_rsa.pub 文件已经生成了。

将SSH key添加到Github账户中
