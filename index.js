function handleFormSubmit(event){
    event.preventDefault();
    let price = event.target.price.value;
    let product = event.target.product.value;
    const obj ={
        price: price,
        product : product
    }
    axios.post('https://crudcrud.com/api/239ff97716a74fedbe05b4dccf3801a8/cart',obj)
    .then(()=>showDetails())
    .catch((err)=>console.log(err));
}
async function showDetails(){
    let totalExpense = 0;
    const ul = document.querySelector('ul');
    ul.innerHTML = '';
    const h2 = document.createElement('h2');
    h2.textContent = 'Products';
    ul.append(h2);
    try{
    const arr = await axios.get('https://crudcrud.com/api/239ff97716a74fedbe05b4dccf3801a8/cart')
    const data = arr.data;
    data.forEach(element => {

        //saving data in local storage
        localStorage.setItem(element._id,`price:${element.price}, product:${element.product}`)

        //fetching expense
        const expense = element.price;
        totalExpense+=parseInt(expense);

        //creating li and delete btn 
        const li = document.createElement('li');
        const str = `${element.price} - ${element.product} `
        li.append(str);
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete Product';
        delBtn.addEventListener('click',()=>{
         totalExpense -= parseInt(expense); 
         axios.delete(`https://crudcrud.com/api/239ff97716a74fedbe05b4dccf3801a8/cart/${element._id}`)
         .then(()=>{
            li.remove();
            localStorage.removeItem(element._id);
            updateTotalExpense(totalExpense);
         }).catch((er)=>console.log(er));
        })
        li.append(delBtn);
        ul.append(li);
    });
}catch(err) {
    console.log(err);
}
    //to show expense block
    updateTotalExpense(totalExpense);
}


function updateTotalExpense(totalExpense) {
    let expenseBlock = document.getElementById('totalExpense');
    
    // If the expenseBlock does not exist, we will create it
    if (!expenseBlock) {
        expenseBlock = document.createElement('h2');
        expenseBlock.id = 'totalExpense';
        const body = document.querySelector('body'); 
        body.appendChild(expenseBlock);
    }
    // Update the text content of the expense block
    expenseBlock.textContent = `Total Value Worth Of Products: Rs${totalExpense}`;
}

document.addEventListener('DOMContentLoaded',showDetails);