        
        var itr, sel, val, div, para, paratxt, opt, txt, item, lastelem, radioInput; //variable declaration
        var arr = new Array();
        var local = false;
        if(!ie7){
        	if(window.localStorage){
        		local= true;
        	}
        }
        
         // Function dynamically creates drop-down
        function createSel(dom) {
            //remove all the child from form div
            removeAll('fdiv');         
            if (typeof(dom) == 'string') {
                //For the first select drop-down
                var val = obj[dom];                // Calls obj['init']
                var header = document.createElement('h1');
                var headertxt = document.createTextNode(val.header);
                header.setAttribute('class', 'header animated bounceInDown'); //calls bounceInDown function from animate.css
                header.appendChild(headertxt);
                var headin = document.createElement('hr');
                headin.setAttribute('class', 'left animated bounceInLeft');
                document.getElementsByTagName('body')[0].appendChild(header);
                document.getElementsByTagName('body')[0].appendChild(headin);
            } else {
                //Value assign for other drop-downs
                var val = obj[dom.value];
                //removes the image div when dropdown value changes
                if (document.getElementById('responseImg')) {
                    document.getElementsByTagName('body')[0].removeChild(document.getElementById('imgDiv'));
                }
                 if (document.getElementById('wrongImg')) {
                    document.getElementsByTagName('body')[0].removeChild(document.getElementById('wrongDiv'));
                }
                //Removes siblings till it exists 
                while (!(dom.nextSibling === null || dom.nextSibling === undefined)) {

                    dom.parentNode.removeChild(dom.nextSibling);
                }
            }
            //Dynamically creates all drop-downs
            var level = parseInt(val.level);
            if (val.value.length !== 0) {
                var ldiv = document.getElementById('ldiv');
                para = document.createElement('p');
                paratxt = document.createTextNode(val.Question);   //Picks question from data.js based on selected option
                para.appendChild(paratxt);
                ldiv.appendChild(para);
                sel = document.createElement('select');
                sel.setAttribute('name', dom.value);
                sel.setAttribute('id', 'styledSelect');
                opt = document.createElement('option');
                txt = document.createTextNode('select');
                opt.appendChild(txt);
                sel.appendChild(opt);
                for (item = 0, len = val.value.length; item < len; item++) {
                    opt = document.createElement('option');
                    opt.setAttribute('value', val.value[item]);
                    txt = document.createTextNode(val.value[item]);
                    opt.appendChild(txt);
                    sel.appendChild(opt);
                }
                ldiv.appendChild(sel);
                ldiv.appendChild(document.createElement('br'));
                document.getElementsByTagName('body')[0].appendChild(ldiv);
                //Stores dom.value at a particular position in a array, which keeps track of the selected value
                arr[level] = dom.value;    
            } else {
                //Reaches to last node, calls function to generate form  
                arr[level] = dom.value;
                document.getElementById('fdiv').style.display = "block";
                generateForm(arr[arr.length - 1]);
            }
            //Calls createSel function with the selected object 
            if (ie7) {
                sel.setAttribute('onchange', function() {    //used wrapper function for IE7
                    createSel(this);
                });
            } else {
                sel.setAttribute('onchange', 'createSel(this);');
            }
        }



        //function to generate form based on the selected input
        var newform;

        function generateForm(lastelem) {
            newform = document.createElement('form');
            newform.setAttribute('class', 'form1 animated zoomIn'); //calls zoomIn animation from animate.css
            var formpara = document.createElement('p');
            var formparatxt = document.createTextNode("Your selected options for drink are:");
            formpara.appendChild(formparatxt);
            newform.appendChild(formpara);
            formpara.appendChild(document.createElement('br'));
            // Displays all the selected options in an un-ordered list 
            var order = document.createElement('ul');
            for (var i = 1, arrLen = arr.length; i < arrLen; i++) {
                var list = document.createElement('li');
                list.style.marginLeft = "20px";
                var txtNode = document.createTextNode(arr[i]);
                list.appendChild(txtNode);
                order.appendChild(list);
                newform.appendChild(list);
            }
            //Generates a quiz question based on the selected option
            var formpara1 = document.createElement('p');
            var formpara1txt = document.createTextNode("Guess your drink...?   ");
            var thinkImg = document.createElement('img');
            thinkImg.setAttribute('src', '../Images/BackGround/thinking.jpg');
            thinkImg.setAttribute('alt', 'thinking');
            thinkImg.setAttribute('id', 'thinking');
            thinkImg.style.width = "50px";
            thinkImg.style.height = "50px";
            formpara1.appendChild(formpara1txt);
            formpara1.appendChild(thinkImg);
            newform.appendChild(formpara1);
            //Radio button options for the guess question 
            if (radio_Obj[lastelem]) {
                for (var k = 0, lastElemLen = radio_Obj[lastelem].rad_val.length; k < lastElemLen; k++) {
                    var lebel = document.createTextNode(radio_Obj[lastelem].rad_val[k]);
                    radioInput = document.createElement('input');
                    radioInput.setAttribute('type', 'radio');
                    radioInput.setAttribute('name', 'qa_radio');
                    radioInput.setAttribute('id', 'qa_radio');
                    radioInput.setAttribute('value', radio_Obj[lastelem].rad_val[k]);
                    newform.appendChild(radioInput);
                    newform.appendChild(lebel);
                    newform.appendChild(document.createElement('br'));
                }

            }

            //Button for the check the answer 
            newform.appendChild(document.createElement('br'));
            var sub = document.createElement('input');
            sub.setAttribute('type', 'button');
            sub.setAttribute('value', 'Check Your Guess');
            //Onclick calls ansCheck() function
            if (ie7) {
                sub.setAttribute('onclick', function() {
                    ansCheck();
                });
            } else {
                sub.setAttribute('onclick', 'ansCheck();');
            }
            newform.appendChild(sub);
            document.getElementById('fdiv').appendChild(newform);
        }

        //Function to remove all child from form div
        function removeAll(id) {
            var node = document.getElementById(id);
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
            document.getElementById('fdiv').style.display = "none";
        }

        // Function validates user's answer  
        var para, wrongAns, rightAns, radioVal, saveform,wrongDiv;
        function ansCheck() {
            if (document.getElementById('pid')) {
                newform.removeChild(document.getElementById('pid'));
            }
            lastEle = arr[arr.length - 1];
            para = document.createElement('p');
            para.setAttribute('id', 'pid');
             wrongDiv = document.createElement('div');
             wrongDiv.setAttribute('id','wrongDiv');
               if (document.getElementById('wrongImg')) {
                document.getElementsByTagName('body')[0].removeChild(document.getElementById('wrongDiv'));
                }
            var radioCheck = getRadioCheckedValue('qa_radio');  //Function calls to find the selected answer option
            
            //In case of a radio option selection, checks for right or wrong answer 
            if (!(radioCheck == null || radioCheck == undefined || radioCheck === '')) {
                radioVal = radioCheck;
                if (document.getElementById('saveform')) {
                    document.getElementById('fdiv').removeChild(document.getElementById('saveform'));
                }

                if (document.getElementById('responseImg')) {
                    document.getElementsByTagName('body')[0].removeChild(document.getElementById('imgDiv'));
                }
                //Message for wrong radio selection 
                if (!(radioVal === radio_Obj[lastEle].corr_val)) {
                    wrongAns = document.createTextNode("Ahh...its' a wrong answer...guess again");
                    para.appendChild(wrongAns);
                    newform.appendChild(para);                   
                    wrongImg = document.createElement('img');
                    wrongImg.style.width = "250px";
                    wrongImg.style.height = "250px";
                    wrongImg.setAttribute('src', '../Images/GIF/TryAgain.gif');
                    wrongImg.setAttribute('alt', 'Try Again');
                    wrongImg.setAttribute('class', 'wrongImg animated rollIn')
                    wrongImg.setAttribute('id', 'wrongImg');
                    wrongDiv.appendChild(wrongImg);
                    document.getElementsByTagName('body')[0].appendChild(wrongDiv);
                } else {
                    //If correct radio option for the final drink is correctly guessed, generates a form to save user input
                    //for future reference
                    
                    rightAns = document.createTextNode("Yeah it's a correct choice...!!!");
                    para.appendChild(rightAns);
                    newform.appendChild(para);
                    saveform = document.createElement('form');
                    saveform.setAttribute('id', 'saveform');
                    var textLabel = document.createElement('label');
                    var fname = document.createTextNode('First Name:');
                    textLabel.appendChild(fname);
                    saveform.appendChild(textLabel);
                    var textbox = document.createElement('input');
                    textbox.setAttribute('type', 'text');
                    textbox.setAttribute('name', 'fname');
                    textbox.setAttribute('id', 'fname');
                    saveform.appendChild(textbox);
                    saveform.appendChild(document.createElement('br'));
                    saveform.appendChild(document.createElement('br'));
                    var textLabel1 = document.createElement('label');
                    var lname = document.createTextNode('Last Name:');
                    textLabel1.appendChild(lname);
                    saveform.appendChild(textLabel1);
                    var textbox1 = document.createElement('input');
                    textbox1.setAttribute('type', 'text');
                    textbox1.setAttribute('name', 'lname');
                    textbox1.setAttribute('id', 'lname');
                    saveform.appendChild(textbox1);
                    saveform.appendChild(document.createElement('br'));
                    saveform.appendChild(document.createElement('br'));
                    var sub = document.createElement('input');
                    sub.setAttribute('type', 'button');
                    sub.setAttribute('value', 'Save Your Response');
                    //Calls saveform function
                    if (ie7) {
                        sub.setAttribute('onclick', function() {
                            saveForm();
                        });
                    } else {
                        sub.setAttribute('onclick', 'saveForm();');
                    }
                    saveform.appendChild(sub);
                    document.getElementById('fdiv').appendChild(saveform);
                }
            } else {
                //Validation for non of the answer selection
                var lastText = document.createTextNode("Please select your answer....");
                para.appendChild(lastText);
                newform.appendChild(para);
            }
        }

        //Function saves user details(FirstName,LastName, and the final drink) in localstorage or cookies
        var savePara, saveText, userName, existingUser, exsistingPara, existingText, newDiv, newPara, newText, correctRes, imgDiv;
        function saveForm() {
            correctRes = radioVal;
            if (!(document.getElementById('savePara_pid') === null)) {
                var item = document.getElementById('savePara_pid');
                item.parentNode.removeChild(item);
            }
            if (!(document.getElementById('existing_pid') === null)) {
                var item = document.getElementById('existing_pid');
                item.parentNode.removeChild(item);
            }
            if (!(document.getElementById('new_pid') === null)) {
                var item = document.getElementById('new_pid');
                item.parentNode.removeChild(item);
            }
            if (document.getElementById('responseImg')) {
                document.getElementsByTagName('body')[0].removeChild(document.getElementById('imgDiv'));
            }
                
            
            var firstName = document.getElementById('fname').value;
            var lastName = document.getElementById('lname').value;
            //Condition when both first name and last name exists
            if (!((firstName === "" || firstName === null) || (lastName === "" || lastName === null))) {
                //Defines trim function for IE7 and IE8
                if (typeof String.prototype.trim !== 'function') {
                    String.prototype.trim = function() {
                        return this.replace(/^\s+|\s+$/g, '');   //regex that removes whitespaces from start and end of an string
                    }
                }
                //concatenate both first and last name to generate user name
                userName = firstName.trim() + lastName.trim();
                
                var existingUser;
                newDiv = document.createElement('div');
                imgDiv = document.createElement('div');


                var responseImg = document.createElement('img');
                // For IE11 and other browser where localstorage works
                if (local) {
                    existingUser = localStorage.getItem(userName);
                    newDiv = document.createElement('div');
                    // if user is an existing user then function displays previously selected drink and saves the current drink
                    if (!(existingUser === undefined || existingUser === null || existingUser === '')) {

                        localStorage.setItem(userName, correctRes);
                        existingPara = document.createElement('p');
                        existingPara.setAttribute('id', 'existing_pid');
                        existingText = document.createTextNode(firstName + " " + lastName + ", Your current response is saved successfully and ");
                        existingPara.appendChild(existingText);
                        existingText = document.createTextNode('Your previous drink was ' + existingUser);
                        existingPara.appendChild(existingText);
                        newDiv.appendChild(existingPara);
                        saveform.appendChild(newDiv);
                    } else {
                        //if not the existing user then store the selected response
                        localStorage.setItem(userName, correctRes);
                        newPara = document.createElement('p');
                        newPara.setAttribute('id', 'new_pid');
                        newText = document.createTextNode(firstName + " " + lastName + ", Your current response is saved successfully..");
                        newPara.appendChild(newText);
                        newDiv.appendChild(newPara);
                        saveform.appendChild(newDiv);
                    }
                } else {
                    //Similar functionality for IE11< version using cookies 
                    existingUser = GetCookie(userName);
                    if (!(existingUser === undefined || existingUser === null || existingUser === '')) {
                        SetCookie(userName, correctRes);
                        existingPara = document.createElement('p');
                        existingPara.setAttribute('id', 'existing_pid');
                        existingText = document.createTextNode(firstName + " " + lastName + ", Your current response is saved successfully and ");
                        existingPara.appendChild(existingText);
                        existingText = document.createTextNode('Your previous drink was ' + existingUser);
                        existingPara.appendChild(existingText);
                        newDiv.appendChild(existingPara);
                        saveform.appendChild(newDiv);
                    } else {
                        SetCookie(userName, correctRes);
                        newPara = document.createElement('p');
                        newPara.setAttribute('id', 'new_pid');
                        newText = document.createTextNode(firstName + " " + lastName + ", Your current response is saved successfully..");
                        newPara.appendChild(newText);
                        newDiv.appendChild(newPara);
                        saveform.appendChild(newDiv);
                    }
                }
                //Displays image of final alcholic/non-alcholic seleted drink(correctly guessed drink) 
                imgDiv.setAttribute('id', 'imgDiv');
                responseImg.style.right = '-100px';
                responseImg.style.position = 'fixed';
                responseImg.style.width = "300px";
                responseImg.style.height = "400px";
                responseImg.setAttribute('src', radio_Obj[arr[arr.length - 1]].final_drink);
                responseImg.setAttribute('alt', 'Final Drink');
                responseImg.setAttribute('id', 'responseImg');
                imgDiv.appendChild(responseImg);
                document.getElementsByTagName('body')[0].appendChild(imgDiv);
                moveIt(document.getElementById('responseImg'), 2);
            } else {
                //Save response form(first name and last name) validation
                savePara = document.createElement('p');
                savePara.setAttribute('id', 'savePara_pid');
                saveText = document.createTextNode("Both the first and last name are required....");
                savePara.appendChild(saveText);
                saveform.appendChild(savePara);
            }
        }


        //Function to get value from selected radio button
        function getRadioCheckedValue(radio_name) {
            var objRadio = document.forms[0].elements[radio_name];

            for (var i = 0, objRadLen = objRadio.length; i < objRadLen; i++) {
                if (objRadio[i].checked) {
                    return objRadio[i].value;
                }
            }

            return '';
        }


        //Function for get cookie 
        function GetCookie(name) {
            var arg = name + "=";
            var alen = arg.length;
            var clen = document.cookie.length;
            var i = 0;
            while (i < clen) {
                var j = i + alen;
                if (document.cookie.substring(i, j) == arg) {
                    return getCookieVal(j);
                }
                i = document.cookie.indexOf(" ", i) + 1;
                if (i == 0) break;
            }
            return null;
        }

        //Function for set cookie 
        function SetCookie(name, value, expires, path, domain, secure) {
            document.cookie = name + "=" + escape(value) +
                ((expires) ? "; expires=" + expires.toGMTString() : "") +
                ((path) ? "; path=" + path : "") +
                ((domain) ? "; domain=" + domain : "") +
                ((secure) ? "; secure" : "");
        }
        
        //Function to get value of the current cookie
		function getCookieVal (offset) {
			var endstr = document.cookie.indexOf (";", offset);
			if (endstr == -1) { endstr = document.cookie.length; }
			return unescape(document.cookie.substring(offset, endstr));
		}

        //Function to move final drink image --- DHTML
        function moveIt(id, speed) {
            var hold = id;
            
            if (parseInt(hold.style.right) < 200) {
                //my pos = my old pos + x;
                hold.style.right = parseInt(hold.style.right) + speed + 'px';
                setTimeout(function() {
                    moveIt(id, speed);
                }, 5);
            }
        }