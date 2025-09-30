const id_do_usuario_element = document.getElementById("id_do_usuario");
const dia_da_semana_reserva_element = document.getElementById("dia_da_semana_reserva");
const horario_reserva_element = document.getElementById("horario_reserva");
const list = document.getElementById("slot-list");
const user = new Serializer('user').load();

async function listar_slots() {
    const resp = await fetch("/slots");
    const info = await resp.json();

    list.innerHTML = "";
    table = criar_tabela_de_horarios(info);
    list.appendChild(table);

    // Object.keys(info).forEach(dia_da_semana => {

    //     const slots = info[dia_da_semana];

    //     slots.forEach(slot => {
    //         if (slot.capacity != 0) {
    //             const li = document.createElement("li");
    //             li.textContent = `${dia_da_semana} - ${slot.time} (capacidade: ${slot.capacity})`;
    //             list.appendChild(li);
    //         }
    //     })
    // });
}

async function minha_reserva() {
    const id_do_usuario_reserva = user._id;

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

/**
 * Coleta todos os checkboxes marcados na tabela e envia uma requisição de reserva para cada um.
 */
async function criar_reservas_selecionadas() {
    // Supondo que o objeto 'user' com o _id está acessível neste escopo.
    // Se não estiver, você precisará obter o ID do usuário de outra forma.
    if (typeof user === 'undefined' || !user._id) {
        alert('Erro: Objeto de usuário não encontrado. Faça o login novamente.');
        return;
    }
    const id_do_usuario = user._id;

    // 1. Encontra todos os checkboxes marcados dentro da tabela de horários
    const checkboxesSelecionados = document.querySelectorAll('.tabela-horarios input[type="checkbox"]:checked');

    if (checkboxesSelecionados.length === 0) {
        alert('Por favor, selecione pelo menos um horário para reservar.');
        return;
    }

    // 2. Cria um array de "promessas" de requisição, uma para cada checkbox
    const promessasDeReserva = Array.from(checkboxesSelecionados).map(checkbox => {
        const dadosDaReserva = {
            userId: id_do_usuario,
            dayOfWeek: checkbox.dataset.day, // Lê o dia do atributo data-day
            time: checkbox.dataset.time      // Lê a hora do atributo data-time
        };

        // Retorna a promessa da requisição fetch
        return fetch('/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosDaReserva)
        }).then(async (resposta) => {
            // Processa a resposta para saber se foi sucesso ou erro
            const resultado = await resposta.json();
            if (!resposta.ok) {
                // Se falhou, rejeita a promessa com a mensagem de erro da API
                return Promise.reject({
                    time: dadosDaReserva.time,
                    day: dadosDaReserva.dayOfWeek,
                    error: resultado.error || 'Erro desconhecido'
                });
            }
            // Se teve sucesso, resolve a promessa com a mensagem de sucesso
            return {
                time: dadosDaReserva.time,
                day: dadosDaReserva.dayOfWeek,
                message: resultado.message
            };
        });
    });

    // 3. Executa todas as promessas em paralelo e aguarda a finalização de todas
    console.log(`Enviando ${promessasDeReserva.length} reservas...`);
    const resultados = await Promise.allSettled(promessasDeReserva);

    // 4. Processa os resultados para dar feedback ao usuário
    let sucessos = [];
    let falhas = [];

    resultados.forEach(res => {
        if (res.status === 'fulfilled') {
            sucessos.push(`- ${res.value.day} às ${res.value.time}`);
        } else {
            // res.status === 'rejected'
            falhas.push(`- ${res.reason.day} às ${res.reason.time}: ${res.reason.error}`);
        }
    });

    // 5. Monta e exibe a mensagem final
    let mensagemFinal = "Resultado das reservas:\n\n";
    if (sucessos.length > 0) {
        mensagemFinal += "Reservas confirmadas com sucesso:\n" + sucessos.join('\n') + "\n\n";
    }
    if (falhas.length > 0) {
        mensagemFinal += "Não foi possível realizar as seguintes reservas:\n" + falhas.join('\n');
    }

    alert(mensagemFinal);

    // Atualiza a lista de horários para refletir as novas reservas
    listar_slots();
}

// async function criar_reserva() {
//     const id_do_usuario = user._id;
//     const dia_da_semana_reserva = dia_da_semana_reserva_element.value;
//     const horario_reserva = horario_reserva_element.value;

//     // 1. Monta o objeto com os dados da reserva.
//     // As chaves (userId, dayOfWeek, time) devem ser exatamente as mesmas que o back-end espera.
//     const dadosDaReserva = {
//         userId: id_do_usuario,
//         dayOfWeek: dia_da_semana_reserva,
//         time: horario_reserva
//     };

//     try {
//         // 2. Faz a requisição POST para a API de bookings
//         const resposta = await fetch('/bookings', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(dadosDaReserva)
//         });

//         // 3. Pega a resposta do servidor em formato JSON
//         const resultado = await resposta.json();

//         // 4. Verifica se a requisição falhou (status não foi 2xx)
//         if (!resposta.ok) {
//             // Exibe a mensagem de erro específica vinda da API
//             console.error('Erro da API:', resultado);
//             alert(`Não foi possível fazer a reserva: ${resultado.error}`); // Ex: "Usuário não encontrado."
//             return null;
//         }

//         // 5. Se deu tudo certo, exibe a mensagem de sucesso e retorna os dados
//         console.log('Sucesso:', resultado);
//         alert(resultado.message); // Ex: "Reserva criada com sucesso!"
//         listar_slots();
//         return resultado.booking;

//     } catch (erro) {
//         // Captura erros de rede ou de conexão
//         console.error('Erro na requisição fetch:', erro);
//         alert('Não foi possível conectar ao servidor para fazer a reserva.');
//         return null;
//     }
// }

function criar_tabela_de_horarios(json_data) {
  // Define a ordem desejada para os dias da semana
  const diasDaSemana = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Coleta todos os horários únicos de todos os dias e os ordena
  const todosOsHorarios = new Set();
  for (const dia in json_data) {
    if (json_data.hasOwnProperty(dia)) {
      json_data[dia].forEach(item => {
        todosOsHorarios.add(item.time);
      });
    }
  }
  const horariosOrdenados = Array.from(todosOsHorarios).sort();

  // Cria o elemento da tabela e o cabeçalho
  const table = document.createElement('table');
  table.className = 'tabela-horarios'; // Adiciona uma classe para estilização opcional
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  // Adiciona uma célula vazia para o canto superior esquerdo
  const thVazio = document.createElement('th');
  headerRow.appendChild(thVazio);

  // Adiciona os cabeçalhos dos dias da semana
  diasDaSemana.forEach(dia => {
    const th = document.createElement('th');
    th.textContent = dia;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Cria o corpo da tabela com os horários e os checkboxes
  const tbody = document.createElement('tbody');
  horariosOrdenados.forEach(horario => {
    const tr = document.createElement('tr');

    // Adiciona a célula com o horário na primeira coluna
    const tdHorario = document.createElement('td');
    tdHorario.textContent = horario;
    tr.appendChild(tdHorario);

    // Itera sobre cada dia da semana para criar as células correspondentes
    diasDaSemana.forEach(dia => {
      const td = document.createElement('td');
      const agendamento = json_data[dia] ? json_data[dia].find(item => item.time === horario) : null;

      // Verifica se existe um agendamento para o dia e horário e se a capacidade é maior que 1
      if (agendamento && agendamento.capacity >= 1) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = agendamento.id; // Atribui o ID do agendamento ao valor do checkbox
        
        //Armazenam o dia e a hora no próprio elemento
        checkbox.dataset.day = dia;       // Ex: "Monday"
        checkbox.dataset.time = horario;  // Ex: "12:00"

        td.appendChild(checkbox);
      }

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);

  return table;
}

listar_slots();
