# 470project
<p>This project can be run locally, but exists on a server at causaldiagram.usask.ca. In order to run the project, you will need some sort of server. Our VM is running Apache HTTP Server, but we used the Python server locally. The steps we used are as follows:</p>
<ul>
<li>Make a project in Google app engine where you set the URL for accepted JS to be localhost:8000</li>
<li>Grab the client id and drop it into the current version (in init file where client id is initialized)</li>
<li>Go to command line and navigate into the project folder</li>
<li>If you have python 3</li>
<li>python -m http.server</li>
<li>If you have python 2</li>
<li>python -m SimpleHTTPServer</li>
<li>If neither of these work, you probably need to add python to your path</li>
<li>The project should now be available at localhost:8000, and you should be able to collaborate with yourself in another tab</li>
</ul>
<p>
Note on the client id part:You could use the existing client id in the project and it would run fine. However, in order to get Drive integration working, you will need access to the project in Google App Engine, meaning you will need a new project and new id anyway. 
</p>
