import { supabase } from "./api/supabase.js"
js
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = supabase.createClient(supabaseUrl, supabaseKey)


async function sendData() {
const title = document.getElementById('title').value
const body = document.getElementById('body').value
const filesInput = document.getElementById('files').files
let urls = []


for (let file of filesInput) {
const path = `${Date.now()}_${file.name}`
await supabase.storage.from('uploads').upload(path, file)
const { data } = supabase.storage.from('uploads').getPublicUrl(path)
urls.push(data.publicUrl)
}


await supabase.from('posts').insert({ title, body, files: urls })
alert('Enviado!')
}


async function loadCards() {
const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
const cards = document.getElementById('cards')


data.forEach(post => {
const div = document.createElement('div')
div.className = 'card'
div.innerHTML = `<h3>${post.title}</h3><div class="plus">+</div>`
div.querySelector('.plus').onclick = () => openModal(post)
cards.appendChild(div)
})
}


function openModal(post) {
const modal = document.getElementById('modal')
const content = document.getElementById('modalContent')


content.innerHTML = `<h3>${post.title}</h3><p>${post.body}</p>`


post.files.forEach(url => {
const img = document.createElement('img')
img.src = url
img.onclick = () => showImage(url)
content.appendChild(img)
})


modal.style.display = 'flex'
modal.onclick = () => modal.style.display = 'none'
}


function showImage(url) {
const modal = document.getElementById('modal')
const content = document.getElementById('modalContent')


content.innerHTML = `
<img src="${url}">
<a class="download-btn" href="${url}" download>Download</a>
`
}