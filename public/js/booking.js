const id_do_usuario_element = document.getElementById("id_do_usuario");
const dia_da_semana_reserva_element = document.getElementById("dia_da_semana_reserva");
const horario_reserva_element = document.getElementById("horario_reserva");
const id_do_usuario_reserva_element = document.getElementById("id_do_usuario_reserva");
const list = document.getElementById("slot-list");


async function listar_slots() {
    const resp = await fetch("/slots");
    const info = await resp.json();

    list.innerHTML = "";

    Object.keys(info).forEach(dia_da_semana => {

        const slots = info[dia_da_semana];

        slots.forEach(slot => {
            if (slot.capacity != 0) {
                const li = document.createElement("li");
                li.textContent = `${dia_da_semana} - ${slot.time} (capacidade: ${slot.capacity})`;
                list.appendChild(li);
            }
        })
    });
}

async function minha_reserva() {
    const id_do_usuario_reserva = id_do_usuario_reserva_element.value;

    const resposta = await fetch(`/bookings/${id_do_usuario_reserva}`);
    const resultado = await resposta.json();

    // Verifica se a requisição falhou (status não foi 2xx)
    if (resultado.length === 0) {
        // Exibe a mensagem de erro específica vinda da API
        // console.error('Erro da API:', resultado);
        alert(`Ainda não temos reserva marcada`); // Ex: "Não tem reserva."
        return null;
    }

    const list = document.getElementById("minha_reserva");
    console.log('Elemento da lista:', list);
    list.innerHTML = "";


    resultado.forEach(reserva => {
        console.log('resultado ' + reserva);

        const li = document.createElement("li");
        li.textContent = `Reserva do cliente: ${reserva.costumerName}, dia: ${reserva.dayOfWeek}, às: ${reserva.time}, registrado: ${reserva.createdAt}`;
        list.appendChild(li);
    });
}

async function criar_reserva() {
    const id_do_usuario = id_do_usuario_element.value;
    const dia_da_semana_reserva = dia_da_semana_reserva_element.value;
    const horario_reserva = horario_reserva_element.value;

    // 1. Monta o objeto com os dados da reserva.
    // As chaves (userId, dayOfWeek, time) devem ser exatamente as mesmas que o back-end espera.
    const dadosDaReserva = {
        userId: id_do_usuario,
        dayOfWeek: dia_da_semana_reserva,
        time: horario_reserva
    };

    try {
        // 2. Faz a requisição POST para a API de bookings
        const resposta = await fetch('/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosDaReserva)
        });

        // 3. Pega a resposta do servidor em formato JSON
        const resultado = await resposta.json();

        // 4. Verifica se a requisição falhou (status não foi 2xx)
        if (!resposta.ok) {
            // Exibe a mensagem de erro específica vinda da API
            console.error('Erro da API:', resultado);
            alert(`Não foi possível fazer a reserva: ${resultado.error}`); // Ex: "Usuário não encontrado."
            return null;
        }

        // 5. Se deu tudo certo, exibe a mensagem de sucesso e retorna os dados
        console.log('Sucesso:', resultado);
        alert(resultado.message); // Ex: "Reserva criada com sucesso!"
        listar_slots();
        return resultado.booking;

    } catch (erro) {
        // Captura erros de rede ou de conexão
        console.error('Erro na requisição fetch:', erro);
        alert('Não foi possível conectar ao servidor para fazer a reserva.');
        return null;
    }
}
