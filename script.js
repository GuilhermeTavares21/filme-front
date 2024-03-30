let jsonFilmes;
let modalTituloHTML = document.querySelector("#modalInputTitulo").value
let modalGenreHTML = document.querySelector("#modalInputGenre").value
let modalDurationHTML = document.querySelector("#modalInputDuration").value

var closeModal = document.querySelector(".closeModal")
closeModal.addEventListener("click",()=>{
    document.querySelector(".modal").style.display = "none"
})

async function inserirFilme() {
    try{
    document.getElementById('h1').innerHTML= "Carregando.. ";

    let title = document.getElementById('exampleInputTitulo').value
    let genre = document.getElementById('exampleInputGenre').value
    let duration = document.getElementById('exampleInputDuration').value

    let req = await fetch('http://25.60.175.138:5125/filme/', {
        method: 'POST',
        body: JSON.stringify({
            titulo: `${title}`,
            genero: `${genre}`,
            duracao: `${duration}`
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let json = await req.json();
    } catch(error) {
        document.getElementById('h1').innerHTML= "Ocorreu um erro";
    } finally {
        document.getElementById('h1').innerHTML= "Filme enviado!";
        document.getElementById('exampleInputTitulo').value = ''
        document.getElementById('exampleInputGenre').value = ''
        document.getElementById('exampleInputDuration').value = 0

        getFilme();
    }
}

async function getFilme() {
    try {
        const response = await fetch('http://25.60.175.138:5125/filme/');
        const data = await response.json();


        const tableBody = document.querySelector('#data-table tbody');
        tableBody.innerHTML = '';


        const trashImg = '<img src="trash.png">'
        const editImg = '<img src="edit.png">'

        // Adicionar os dados à tabela
        data.forEach(item => {
            const row = tableBody.insertRow();
            const cell0 = row.insertCell(0);
            const cell1 = row.insertCell(1);
            const cell2 = row.insertCell(2);
            const cell3 = row.insertCell(3);
            const cell4 = row.insertCell(4);
            const cell5 = row.insertCell(5);
            cell0.textContent = item.id; 
            cell1.textContent = item.titulo; 
            cell2.textContent = item.genero; 
            cell3.textContent = item.duracao;


                const editButton = document.createElement('button');
        editButton.innerHTML = editImg
        editButton.addEventListener('click', () => {
            document.querySelector(".modal").style.display = "block"
        })

        editButton.addEventListener('click', async () => {
            try {
                const responseEdit = await fetch(`http://25.60.175.138:5125/filme/${item.id}`)
                const dataEdit = await responseEdit.json();

                document.querySelector("#modalInputTitulo").value = dataEdit.titulo
                document.querySelector("#modalInputGenre").value = dataEdit.genero
                document.querySelector("#modalInputDuration").value = dataEdit.duracao
                confirmEditHTML = document.getElementById("confirmEdit")
                confirmEditHTML.addEventListener('click', async () => {
                    try{
                        let titleEdit = document.querySelector("#modalInputTitulo").value
                        let genreEdit = document.querySelector("#modalInputGenre").value
                        let durationEdit = document.querySelector("#modalInputDuration").value
                    
                        let req = await fetch(`http://25.60.175.138:5125/filme/${dataEdit.id}`, {
                            method: 'PUT',
                            body: JSON.stringify({
                                titulo: `${titleEdit}`,
                                genero: `${genreEdit}`,
                                duracao: `${durationEdit}`
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        let json = await req.json();
                        } catch(error) {
                            console.log("Ocorreu um erro");
                        } finally {
                            document.querySelector(".modal").style.display = "none";
                            alert(`Filme ${dataEdit.titulo} alterado com sucesso!`)
                        }
                })
        
                
                
            } catch(error){
                console.log("Error...")
            }
        });

        cell4.appendChild(editButton);
        
        // Botão para excluir
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = trashImg
        deleteButton.addEventListener('click', async () => {
            try {
                // Faça a requisição para excluir o item
                await fetch(`http://25.60.175.138:5125/filme/${item.id}`, {
                    method: 'DELETE'
                });
                
                // Remova a linha da tabela após excluir o item
                tableBody.removeChild(row);
            } catch (error) {
                console.error('Ocorreu um erro ao excluir o item:', error);
            }
        });
        cell5.appendChild(deleteButton);
        }) 
    } catch (error) {
        console.error('Ocorreu um erro ao obter os dados:', error);
    }
}