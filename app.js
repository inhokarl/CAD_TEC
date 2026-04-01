const ACCESS_CODE="1234"

const loginScreen=document.getElementById("login-screen")
const mainScreen=document.getElementById("main-screen")
const reportScreen=document.getElementById("report-screen")

function show(screen){

loginScreen.classList.remove("active")
mainScreen.classList.remove("active")
reportScreen.classList.remove("active")

screen.classList.add("active")

}

document.getElementById("login-form").addEventListener("submit",e=>{

e.preventDefault()

const code=document.getElementById("access-code").value

if(code===ACCESS_CODE){

show(mainScreen)

}else{

document.getElementById("login-error").textContent="Código inválido"

}

})

document.getElementById("logout-btn").onclick=()=>{

show(loginScreen)

}

document.getElementById("report-btn").onclick=()=>{

const data=getForm()

document.getElementById("report-preview").textContent=
JSON.stringify(data,null,2)

show(reportScreen)

}

document.getElementById("back-btn").onclick=()=>{

show(mainScreen)

}

function getForm(){

return{

data:new Date(),

modelo:document.getElementById("modelo").value,
quantidade:document.getElementById("quantidade").value,
disjuntor:document.getElementById("disjuntor").value,

telefone:document.getElementById("telefone").value,
email:document.getElementById("email").value,

cpf:document.getElementById("cpf").value,
rg:document.getElementById("rg").value

}

}

function getAllImages(){

const inputs=document.querySelectorAll("input[type=file]")

let files=[]

inputs.forEach(input=>{

for(let i=0;i<input.files.length;i++){

files.push(input.files[i])

}

})

return files

}

function compressImage(file){

return new Promise(resolve=>{

const reader=new FileReader()

reader.onload=e=>{

const img=new Image()

img.onload=()=>{

const canvas=document.createElement("canvas")

let width=img.width
let height=img.height

const maxWidth=1200

if(width>maxWidth){

height*=maxWidth/width
width=maxWidth

}

canvas.width=width
canvas.height=height

const ctx=canvas.getContext("2d")

ctx.drawImage(img,0,0,width,height)

resolve(canvas.toDataURL("image/jpeg",0.7))

}

img.src=e.target.result

}

reader.readAsDataURL(file)

})

}

document.getElementById("generate-pdf").onclick=async()=>{

const {jsPDF}=window.jspdf

const doc=new jsPDF()

const data=getForm()

let y=10

doc.setFontSize(12)

for(const key in data){

doc.text(`${key}: ${data[key]}`,10,y)

y+=8

}

const images=getAllImages()

for(const file of images){

const base64=await compressImage(file)

doc.addPage()

doc.addImage(base64,"JPEG",10,10,190,0)

}

doc.save("projeto.pdf")

}

