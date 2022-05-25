class Despesa {
  constructor(ano, mes, dia, tipo, desc, valor) {
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
    this.tipo = tipo;
    this.desc = desc;
    this.valor = valor;
  }

  validFields = () => {
    for (let i in this) {
      if (this[i] == undefined || this[i] == '' || this[i] == null) {
        return false;
      };
    };

    return true;
  }
}

class Db {
  constructor() {
    const id = localStorage.getItem('id')

    if (id === null) {
      localStorage.setItem('id', 0)
    }
  }

  getDados = () => {
    let despesas = []
    let id = localStorage.getItem('id')
    let numeroId = JSON.parse(id)
    for (let i = 1; i <= numeroId; i++) {
      despesas.push(JSON.parse(localStorage.getItem(i)))
    }
    return despesas
  }

  getNextId = () => {
    const nextId = localStorage.getItem('id')
    return parseInt(nextId) + 1;
  }

  create = (despesa) => {
    const id = this.getNextId()
    localStorage.setItem(id, JSON.stringify(despesa))
    localStorage.setItem('id', id);
  }
}

const db = new Db();

const tipo = [
  'Alimentação',
  'Educação',
  'Lazer',
  'Saúde',
  'Transporte',
]

function carregaLista() {
  const despesas = db.getDados()
  console.log(despesas)
  let table = document.getElementById('tbody_despesas')

  despesas.map((element) => {
    var linha = table.insertRow()
    linha.insertCell(0).innerHTML = `${element.dia}/${element.mes}/${element.ano}`
    linha.insertCell(1).innerHTML = tipo[element.tipo - 1]
    linha.insertCell(2).innerHTML = element.desc
    linha.insertCell(3).innerHTML = element.valor
  })
  //   linha = table.insertRow();
  // linha.insertCell(0).innerHTML =  despesas
}
const tbody2 = document.querySelector("tbody")
const renderizarComFiltro = () => {
  tbody2.innerHTML = ""
  let ano = document.getElementById('ano')
  let mes = document.getElementById('mes')
  let dia = document.getElementById('dia')
  let tipo = document.getElementById('tipo')
  let descricao = document.getElementById('descricao')
  let valor = document.getElementById('valor')

  const despesas = db.getDados()

  const filtered = despesas
  .filter((dispesa) => ano.value ? dispesa.ano === ano.value : dispesa)
  .filter((dispesa) => dia.value ? dispesa.dia === dia.value : dispesa)
  .filter((dispesa) => mes.value ? dispesa.mes === mes.value : dispesa)
  .filter((dispesa) => tipo.value ? dispesa.tipo === tipo.value : dispesa)
  .filter((dispesa) => descricao.value ? dispesa.descricao === descricao.value : dispesa)
  .filter((dispesa) => valor.value ? dispesa.valor === valor.value : dispesa)

  filtered.map((element) => {
    const linha = tbody2.insertRow()
    linha.insertCell(0).innerHTML = `${element.dia}/${element.mes}/${element.ano}`
    linha.insertCell(1).innerHTML = tipo[element.tipo - 1]
    linha.insertCell(2).innerHTML = element.desc
    linha.insertCell(3).innerHTML = element.valor
  });
}


const capturarDespesa = () => {
  let ano = document.getElementById('ano')
  let mes = document.getElementById('mes')
  let dia = document.getElementById('dia')
  let tipo = document.getElementById('tipo')
  let descricao = document.getElementById('descricao')
  let valor = document.getElementById('valor')

  const despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value,
  )

  if (despesa.validFields()) {
    db.create(despesa);

    document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
    document.getElementById('modal_titulo_div').className = 'modal-header text-success'
    document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
    document.getElementById('modal_btn').innerHTML = 'voltar';
    document.getElementById('modal_btn').className = 'btn btn-success'

    $('#modalRegistroDespesa').modal('show')
  } else {
    document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
    document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
    document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos!'
    document.getElementById('modal_btn').innerHTML = 'voltar e corrigir';
    document.getElementById('modal_btn').className = 'btn btn-danger'

    $('#modalRegistroDespesa').modal('show')
  }
}
