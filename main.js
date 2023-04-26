
// Tạo product khi add cart
const addCartBtns = document.querySelectorAll('.card__action-addCard')
const listCards = document.querySelectorAll('.list-cards .card')
const listCarts = document.querySelector('.list-carts')
let cartItems = []

function updateColor(inputQuantity) {
    if (inputQuantity) {
        const minusColors = inputQuantity.previousElementSibling.querySelectorAll("i");
        const plusColors = inputQuantity.nextElementSibling.querySelectorAll("i");
        let currentValue = parseInt(inputQuantity.value)
        minusColors.forEach((color) => {
            switch (currentValue) {
                case 1: color.style.backgroundColor = 'rgb(204, 204, 204)'
                    break
                default: color.style.backgroundColor = 'rgb(40, 138, 214)'
            }
        })
        plusColors.forEach((color) => {
            switch (currentValue) {
                case 10: color.style.backgroundColor = 'rgb(204, 204, 204)'
                    break
                default: color.style.backgroundColor = 'rgb(40, 138, 214)'
            }
        })
    }
}

function modifyInputValue(inputQuantity, val) {
    let currentValue = parseInt(inputQuantity.value)
    const minValue = parseInt(inputQuantity.getAttribute('min'))
    const maxValue = parseInt(inputQuantity.getAttribute('max'))
    if (currentValue + val >= minValue && currentValue + val <= maxValue) {
        inputQuantity.value = currentValue + val
        updateColor(inputQuantity)

        // update cartItems[index].quantity
        const productItem = inputQuantity.closest(".product-item")
        const index = Array.from(productItem.parentElement.children).indexOf(productItem)

        cartItems[index].quantity = currentValue + val
    }
    renderTotalProvisional()
}

function updateInputQuantity(inputQuantity, minValue, maxValue) {
    let currentValue = parseInt(inputQuantity.value)
    if (currentValue > maxValue) {
        inputQuantity.value = maxValue
    }
    if (currentValue < minValue) {
        inputQuantity.value = minValue
    }
    updateColor(inputQuantity)
}

function calculateToltalPrice() {
    let totalPrice = 0
    cartItems.forEach(item => {
        let price = item.price.replaceAll('.', '').replace('₫', '')
        totalPrice += parseInt(price) * item.quantity
    })
    return totalPrice.toLocaleString('de-DE') + '₫'
}

function calculateToltalQuantity() {
    let totalQuantiy = 0
    cartItems.forEach(item => {
        totalQuantiy += item.quantity
    })
    return `Tạm tính (${totalQuantiy} sản phẩm):`
}

function renderTotalProvisional() {
    let totalPrice = calculateToltalPrice()
    let totalQuantiy = calculateToltalQuantity()
    const totalMoneyEl = document.querySelector('.total-money')
    const totalLabelEl = document.querySelector('.total-label')

    totalMoneyEl.innerText = totalPrice
    totalLabelEl.innerText = totalQuantiy
}

function handleToggleEmptyCart() {
    const emptyCartEl = document.querySelector('.cart-empty')
    const totalProvisionalEl = document.querySelector('.total-provisional')
    if (cartItems.length === 0) {
        emptyCartEl.style.display = 'block'
        totalProvisionalEl.style.display = 'none'
    } else {
        emptyCartEl.style.display = 'none'
        totalProvisionalEl.style.display = 'block'
    }

}

function handleAddCardItem(img, name, price, color) {
    let productItems = document.querySelectorAll('.product-item')
    let existingCartItem = cartItems.find(item => item.img === img && item.name === name && item.price === price)

    if (existingCartItem) {
        const index = cartItems.findIndex(item => item.img === img && item.name === name && item.price === price)
        // Tăng giá trị của quantity lên 1 khi existingCartItem
        if (cartItems[index].quantity < 10) {
            cartItems[index].quantity++
        } else {
            alert('Sản phảm đã hết')
        }

        // Cập nhật lại giá trị cho color
        cartItems[index].color = color

    } else {
        // Set giá trị hiện tại của inputQuantity vào key quantity
        cartItems.push({ img, name, price, color, quantity: 1 })
    }
    let cartItemHtmls = cartItems.map((item) => {
        return `<li class="product-item">
        <div class="leftSide">
            <a href="" class="product-item__img" target="_blank">
                <img src="${item.img}"
                    alt="">
            </a>
            <button class="product-item__deleteBtn">
                <span></span>
                Xóa
            </button>
        </div>
        <div class="rightSide">
            <a href="" class="product-item__name">${item.name}</a>
            <span class="product-item__price">
                ${item.price}
                <strike>9.500.000₫</strike>
            </span>
            <hr style="width: 65%; visibility: hidden;">
            <div class="product-item__note">
                <span>Giá rẻ online</span>
            </div>
            <div class="product-item__color-and-quantity">
                <div class="product-item__color">
                    Màu:
                    <span class="color-text">${item.color}</span>
                </div>
                <div class="product-item__quantity">
                    <div class="minus">
                        <i></i>
                    </div>
                    <input type="number" value="${item.quantity}" min="1" max="10">
                    <div class="plus">
                        <i style="background-color: rgb(40, 138, 214);"></i>
                        <i style="background-color: rgb(40, 138, 214);"></i>
                    </div>
                </div>
            </div>
        </div>
                </li>`
    })
    listCarts.innerHTML = cartItemHtmls.join('')

    // Gán lại giá trị của productItems sau khi listCarts đã render HTML
    productItems = document.querySelectorAll('.product-item')

    // Tăng giảm số lượng ô inputQuantity
    productItems.forEach(item => {
        const inputQuantity = item.querySelector('.product-item__quantity input[type="number"]')
        const minusBtn = item.querySelector('.product-item__quantity .minus')
        const plusBtn = item.querySelector('.product-item__quantity .plus')
        const minValue = parseInt(inputQuantity.getAttribute('min'))
        const maxValue = parseInt(inputQuantity.getAttribute('max'))

        minusBtn.addEventListener('click', () => modifyInputValue(inputQuantity, -1))
        plusBtn.addEventListener('click', () => modifyInputValue(inputQuantity, 1))
        inputQuantity.addEventListener('input', () => updateInputQuantity(inputQuantity, minValue, maxValue))
        updateColor(inputQuantity)
    })

    // Xóa sản phẩm ra khỏi giỏ hàng
    function handleDeleteCartItem(event) {
        const buttonClicked = event.target
        const productItem = buttonClicked.closest('.product-item')
        const index = Array.from(productItem.parentElement.children).indexOf(productItem)

        cartItems.splice(index, 1)

        productItem.remove()
        renderTotalProvisional()
        handleToggleEmptyCart()
    }

    const deleteBtns = document.querySelectorAll('.product-item__deleteBtn')
    deleteBtns.forEach((deleteBtn) => {
        deleteBtn.addEventListener('click', handleDeleteCartItem)
        renderTotalProvisional()
        handleToggleEmptyCart()
    })
}


addCartBtns.forEach((addCartBtn) => {
    addCartBtn.addEventListener('click', (event) => {
        const card = event.target.closest('.card')
        const cardImage = card.querySelector('img').src
        const cardName = card.querySelector('.card__title').innerText
        const cardPrice = card.querySelector('.card__price').innerText
        const cardColor = card.querySelector('.card__color-active .color__text')

        if (!cardColor) {
            alert('Hãy chọn số lượng và size trước khi thêm sản phẩm vào giỏ hàng')
        } else {
            const cardColorText = cardColor.innerText
            handleAddCardItem(cardImage, cardName, cardPrice, cardColorText)
        }


    })
})

// Active color và size của card
const cardList = document.querySelectorAll('.card')

cardList.forEach(card => {
    const spanColorList = card.querySelectorAll('.green, .red, .black');
    spanColorList.forEach(span => {
        span.onclick = () => {
            // Xóa class card__color-active của các phần tử span khác
            Array.from(spanColorList).forEach(otherSpan => {
                if (otherSpan !== span && otherSpan.classList.contains('card__color-active')) {
                    otherSpan.classList.remove('card__color-active')
                }
            })

            // Thêm class card__color-active cho phần tử span hiện tại
            span.classList.toggle('card__color-active')
        }
    })
})






