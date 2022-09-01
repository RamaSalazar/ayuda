// Class
class Products{
    constructor(id, title, description, precio, img){
        this.id = id,
        this.title = title,
        this.description = description,
        this.precio = precio,
        this.img = img

    }
    showData(){
        console.log(`El producto es ${this.title} su descripcion es ${this.description} y su vales es $${this.precio}. La id del producto es ${this.id}`)
    }title
}

     const cards = document.getElementById('cards')
     const items = document.getElementById('items')
     const footer = document.getElementById('footer')
     const templateCard = document.getElementById('template-card').content
     const templateFooter = document.getElementById('template-footer').content
     const templateCarrito = document.getElementById('template-carrito').content
     const fragment = document.createDocumentFragment()
     let carrito = {}
     
     // Eventos
     // El evento DOMContentLoaded es disparado cuando el documento HTML ha sido completamente cargado y parseado
    //  document.addEventListener('DOMContentLoaded', e => { fetchData() });
    document.addEventListener('DOMContentLoaded', e => { toggleText() });
     cards.addEventListener('click', e => { addCarrito(e) });
     items.addEventListener('click', e => { btnAumentarDisminuir(e) })
     
     // Traer productos

    //  const fetchData = async () => {
    //      const res = await fetch('api.json');
    //      const data = await res.json()
    //      // console.log(data)
    //      pintarCards(data)
    //  }
     const stock = []
     fetch("api.json")
     .then(resp => resp.json())
     .then(data=>{
         console.log(data);
         for(let prod of data){
             let newProd = new Products(prod.id, prod.title, prod.description, prod.precio, prod.img)
             stock.push (newProd)
    
         }

     })
 
    let articleProducts = document.getElementById("products")
        articleProducts.setAttribute("class", "productsStyle")
    let hide__text__btn = document.getElementById ("hide__text__btn")
    let hide__text = document.getElementById("hide__text")
        hide__text__btn.addEventListener("click", toggleText)


    function toggleText(){
     hide__text.classList.toggle("show")
     
     articleProducts.innerHTML= ""
     
     if(hide__text.classList.contains("show")){
     
     hide__text__btn.innerHTML = "ver menos"
     
     }
     
     else {
     
     hide__text__btn.innerHTML = "ver mas"
     
     }
     

     stock.forEach((prod) =>{
     
     let newProduct = document.createElement("div")
    
newProduct.innerHTML = `
<article class="row" id="cards">
  <section class="col-12 mb-2">
    <div class="card">
      <div class="card-body">
      <h2 class="card__title">${prod.title}</h2>
      <p class="card__description">${prod.description}</p>
      <h4 class="card__price">$${prod.precio}</h4>
        <button class="btn btn-dark" data-id"${prod.id}">comprar</button>
      </div>
    </div>
  </section>
</article>
`
     articleProducts.appendChild(newProduct)

     })
     }

// h5 -> h2    p->h4
     // Pintar productos
     const pintarCards = data => {
         data.forEach(item => {
             templateCard.querySelector('h2').textContent = item.title
             templateCard.querySelector('p').textContent = item.description
             templateCard.querySelector('h4').textContent = item.precio
             templateCard.querySelector('button').dataset.id = item.id
             const clone = templateCard.cloneNode(true)
             fragment.appendChild(clone)
         })
         cards.appendChild(fragment)
     }
     
     // Agregar al carrito
     const addCarrito = e => {
         if (e.target.classList.contains('btn-dark')) {
             // console.log(e.target.dataset.id)
             // console.log(e.target.parentElement)
             setCarrito(e.target.parentElement)
         }
         e.stopPropagation()
     }
     
     const setCarrito = item => {
         // console.log(item)
         const producto = {
             title: item.querySelector('h2').textContent,
             description: item.querySelector('p').textContent,
             precio: item.querySelector('h4').textContent,
             id: item.querySelector('button').dataset.id,
             cantidad: 1
         }
        //  console.log(producto)
         if (carrito.hasOwnProperty(producto.id)) {
             producto.cantidad = carrito[producto.id].cantidad + 1
         }
     
         carrito[producto.id] = { ...producto }
         
         pintarCarrito()
     }
     
     const pintarCarrito = () => {
         items.innerHTML = ''
     
         Object.values(carrito).forEach(producto => {
             templateCarrito.querySelector('th').textContent = producto.id
             templateCarrito.querySelectorAll('td')[0].textContent = producto.title
             templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
             templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad
             
             //botones
             templateCarrito.querySelector('.btn-info').dataset.id = producto.id
             templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
     
             const clone = templateCarrito.cloneNode(true)
             fragment.appendChild(clone)
         })
         items.appendChild(fragment)
     
         pintarFooter()
         localStorage.setItem('carrito', JSON.stringify(carrito))
     }
     
     const pintarFooter = () => {
         footer.innerHTML = ''
         
         if (Object.keys(carrito).length === 0) {
             footer.innerHTML = `
             <th scope="row" colspan="5">Carrito vacío con innerHTML</th>
             `
             return
         }
         
         // sumar cantidad y sumar totales
         const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
         const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
         // console.log(nPrecio)
     
         templateFooter.querySelectorAll('td')[0].textContent = nCantidad
         templateFooter.querySelector('span').textContent = nPrecio
     
         const clone = templateFooter.cloneNode(true)
         fragment.appendChild(clone)
     
         footer.appendChild(fragment)
     
         const boton = document.querySelector('#vaciar-carrito')
         boton.addEventListener('click', () => {
             carrito = {}
             pintarCarrito()
         })
     
     }
     
    const btnAumentarDisminuir = e => {
        // console.log(e.target.classList.contains('btn-info'))
        if (e.target.classList.contains('btn-info')) {
            const producto = carrito[e.target.dataset.id]
            producto.cantidad++
            carrito[e.target.dataset.id] = { ...producto }
            pintarCarrito()
        }
    
        if (e.target.classList.contains('btn-danger')) {
            const producto = carrito[e.target.dataset.id]
            producto.cantidad--
            if (producto.cantidad === 0) {
                delete carrito[e.target.dataset.id]
            } else {
                carrito[e.target.dataset.id] = {...producto}
            }
            pintarCarrito()
        }
        e.stopPropagation()
    }

    //  Local Storage
    document.addEventListener('DOMContentLoaded', e => {
toggleText()
        if (localStorage.getItem('carrito')) {
            carrito = JSON.parse(localStorage.getItem('carrito'))
            pintarCarrito()
        }
    });
    