# 470project
<h2>Causal</h2>
<p>Causal is a collaborative causal loop diagram building system.  This system solves the problem of having to gather around one computer to collaborate when designing causal loop diagrams.  The features of this system are built on top of the Google Realtime API, Google Drive API, and JointJS.  This system allows users to create diagrams with variables, connections, and loops, share their diagrams with other users by adding additional users’ email in Google Drive, and all work on the same diagram simultaneously.  Users can edit, save, create new diagrams, and continue editing previous diagrams. </p>
<p>
Three different elements can be placed into a diagram: variables, connections, and loops.  The canvas is an SVG and each of these elements are compound SVG elements that have their foundation in JointJS.  Each of the elements have attributes that can be modified.  Variables have a label, shape, size, position, and fill color.  Connections have a label, arrow with polarity, and line color.  Loops have a label and an image chosen from eight different loop options.  Connections can be connected to variables and maintain their connections while variables and/or connections are moved.  Each element has its own Custom Collaborative Objects that contains all of the element’s attributes so that they can be updated and seen by all collaborators.  Elements can be added and removed from the model, as well as attribute changes can be undone and redone. </p>

<h2>Running the project</h2>
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
