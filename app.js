const ACCESS_CODE="1234"

const loginScreen=document.getElementById("login-screen")
const mainScreen=document.getElementById("main-screen")

function show(screen){

loginScreen.classList.remove("active")
mainScreen.classList.remove("active")

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

function getForm(){

return{

data:new Date().toLocaleDateString(),

cliente:document.getElementById("cliente").value,
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

// CABEÇALHO
doc.setFillColor(13,110,253)
doc.rect(0,0,210,20,"F")

doc.setTextColor(255,255,255)
doc.setFontSize(18)
doc.text("CAD_TEC",10,13)

doc.setFontSize(10)
doc.text(`Data: ${data.data}`,160,13)

// TÍTULO
doc.setTextColor(0,0,0)
doc.setFontSize(16)
doc.text("Cadastro de Projeto",10,35)

// LINHA
doc.setDrawColor(200)
doc.line(10,38,200,38)

doc.setFontSize(12)

let y=50

function campo(label,valor){

doc.setFont(undefined,"bold")
doc.text(label,10,y)

doc.setFont(undefined,"normal")
doc.text(valor?String(valor):"-",70,y)

y+=8

}

campo("Cliente:",data.cliente)
campo("Modelo:",data.modelo)
campo("Quantidade:",data.quantidade)
campo("Disjuntor:",data.disjuntor)
campo("Telefone:",data.telefone)
campo("Email:",data.email)
campo("CPF:",data.cpf)
campo("RG:",data.rg)

// RODAPÉ
doc.setFontSize(10)
doc.text("Documento gerado pelo sistema CAD_TEC",10,285)

// IMAGENS
const images=getAllImages()

for(const file of images){

const base64=await compressImage(file)

doc.addPage()

doc.setFontSize(12)
doc.text("Anexo",10,10)

doc.addImage(base64,"JPEG",10,20,190,0)

}

doc.save(`${data.cliente}.pdf`)

document.getElementById("project-form").reset()

window.scrollTo(0,0)

}