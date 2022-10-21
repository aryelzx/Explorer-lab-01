import "./css/index.css"
import IMask from "imask" //input mask guide

// Variáveis; DOM
//pegando os path's dos filhos de g dentro do svg.
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
//pegando a imagem de logo da bandeira do cartão, visa ou master.
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")
//pegando o input do cvc através do id.
const securityCode = document.querySelector("#security-code")
//padrão da máscara de 4 digitos[imask]
const securityCodePattern = { mask: "0000" }
//Simple use case da documentação do IMask para o securityCodeMasked
const securityCodeMasked = IMask(securityCode, securityCodePattern)
//pegando a data de validade do cc
const expirationDate = document.querySelector("#expiration-date")
//especificação da data de validade
const expirationDatePattern = {
  mask: "MM{/}YY", //padrão de máscara de digitos e expiração
  blocks: {
    //especificação do ano
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    //especificação do mês
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
//Simple use case da documentação do IMask
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

//especificação do numero do cartão
const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      //expressão regular do Número do cartão
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2,9]\d|^[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      regex:
        /^(4011|431274|438935|451416|457393|4576|457631|457632|504175|627780|636297|636368|636369|(6503[1-3])|(6500(3[5-9]|4[0-9]|5[0-1]))|(6504(0[5-9]|1[0-9]|2[0-9]|3[0-9]))|(650(48[5-9]|49[0-9]|50[0-9]|51[1-9]|52[0-9]|53[0-7]))|(6505(4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-8]))|(6507(0[0-9]|1[0-8]))|(6507(2[0-7]))|(650(90[1-9]|91[0-9]|920))|(6516(5[2-9]|6[0-9]|7[0-9]))|(6550(0[0-9]|1[1-9]))|(6550(2[1-9]|3[0-9]|4[0-9]|5[0-8]))|(506(699|77[0-8]|7[1-6][0-9))|(509([0-9][0-9][0-9])))/,
      cardtype: "elo",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  //no tipo de mascara dynamic, se usa a propriedade dispatcj que é uma função acionada toda vez que digitasse no input do numero do cartao
  dispatch: function (appended, dynamicMasked) {
    //filtro para aceitar somente numeros
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    //filtro para comparar com o regex os numeros digitados.
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)
//especificação do cvc e mostrando
function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "000" : code
}
securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})
//mostrar ao digitar
expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerText = date.length === 0 ? "MM/YY" : date
}
//mostrar o número do cartão
cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updrateCardNumber(cardNumberMasked.value)
})
function updrateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "0000 0000 0000 0000" : number
}

//botão
const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cartão Adicionado com Sucesso!")
})
//não recarregar a página ao clicar
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})
//mostrar o que for digitado no input do nome, no cartão
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText = cardHolder.value.length === 0 ? "NOME" : cardHolder.value
})

// Funções
//funcao que define a cor do cartao.
function setCardType(type) {
  //estrutura de dados para definir as cores dentro de arrys de cores.
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    elo: ["#F2C912", "#E24428"],
    default: ["black", "gray"],
  }

  //funcionalidade que vai receber o nome do atributo que eu quero modificar, e o segundo acessa o objeto colors através da variavel type. e a posição do array.
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  // seta o atributo da imagem de acordo com o type.
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}
setCardType("default")
globalThis.setCardType = setCardType
