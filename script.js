const sidebar=document.getElementById('sidebar')
function toggleSidebar(){sidebar.classList.toggle('collapsed')}
function toggleTheme(){document.body.classList.toggle('dark');localStorage.theme=document.body.classList.contains('dark')?'dark':'light'}
if(localStorage.theme==='dark')document.body.classList.add('dark')

const stats={followers:12840,likes:9340,comments:1840,shares:760}
Object.keys(stats).forEach(k=>{let el=document.getElementById(k);let i=0;let int=setInterval(()=>{i+=Math.ceil(stats[k]/60);if(i>=stats[k]){i=stats[k];clearInterval(int)}el.innerText=i.toLocaleString()},20)})

const posts=[
{name:'Travel Reel',likes:1200,comments:210,status:'Published'},
{name:'Product Launch',likes:980,comments:150,status:'Scheduled'},
{name:'Meme Post',likes:2230,comments:400,status:'Published'},
{name:'Tutorial Video',likes:870,comments:95,status:'Draft'}]

const table=document.getElementById('postTable')
const filter=document.getElementById('filterStatus')
function render(){table.innerHTML='';posts.filter(p=>filter.value==='all'||p.status===filter.value).forEach(p=>{table.innerHTML+=`<tr><td>${p.name}</td><td>${p.likes}</td><td>${p.comments}</td><td><span class='status ${p.status}'>${p.status}</span></td></tr>`})}
filter.onchange=render;render()