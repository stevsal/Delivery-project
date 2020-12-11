class Model {
    constructor() {
        this.outgoings = [
            {id:1, title: 'Praha',time: "12:45", complete: true},
            {id:2, title: 'Wien',time: "14:00", complete: false},
        ]

        this.incomings = [
            {id:1, title: 'Brno', time: '10:10', complete: false},
            {id:2, title: 'Münich', time: '16:00', complete: false},
        ]
    }

    bindOutgoingsChanged(callback) {
        this.onOutgoingsChanged = callback
    }

    bindIncomingsChanged(callback) {
        this.onIncomingsChanged = callback
    }

    addOutgoing(place,departure){
        const outgoing = {
            id: this.outgoings.length > 0 ? this.outgoings[this.outgoings.length - 1].id + 1 : 1,
            title: place,
            time: departure,
            complete: false,
        }
        this.outgoings.push(outgoing)

        this.onOutgoingsChanged(this.outgoings)
    }

    addIncoming(place,arrival){
        const incoming = {
            id: this.incomings.length > 0 ? this.incomings[this.incomings.length - 1].id + 1 : 1,
            title: place,
            time: arrival,
            complete: false,
        }
        this.incomings.push(incoming)
        this.onIncomingsChanged(this.incomings)
    }

    toggleOutgoing(id) {
        this.outgoings = this.outgoings.map((outgoing) => 
        outgoing.id === id ? {id:outgoing.id, title: outgoing.title, time: outgoing.time, complete: !outgoing.complete } : outgoing)
        this.onOutgoingsChanged(this.outgoings)
        console.log("complete ?");
    }

    //addIncoming(place)
}

class View {
    constructor() {
        this.app = this.getElement('#root')
        this.title = this.createElement('h1')
        this.title.textContent = 'Outgoings'
        this.form = this.createElement('form')
        this.input = this.createElement('input')
        this.input.type = 'text'
        this.input.placeholder = 'add place'
        this.input.name = 'outgoing'
        this.input2 = this.createElement('input')
        this.input2.type = 'text'
        this.input2.placeholder = 'add time'
        this.input2.name = 'outgoingTime'
        this.submitButton = this.createElement('button')
        this.submitButton.textContent = 'submit'
        this.checkbox = this.createElement('input')
        this.checkbox.type = 'checkbox'
        this.checkboxTitle = this.createElement('label', 'type')
        this.checkboxTitle.id = 'outInc'
        this.checkboxTitle.textContent = ''
        this.outgoingList = this.createElement('ul', 'Outgoings')
        this.title2 = this.createElement('h1')
        this.title2.textContent = 'Incomings'
        this.incomingsList = this.createElement('ul', 'Incomings')
        this.form.append(this.input, this.input2, this.submitButton, this.checkbox, this.checkboxTitle  )
        this.app.append(this.title, this.form, this.outgoingList, this.title2, this.incomingsList)
    }
    createElement(tag, className) {
        const element = document.createElement(tag)
        if (className) {
            element.classList.add(className)
        }
        return element
    }

    getElement(selector){
        const element = document.querySelector(selector)

        return element
    }

    checkboxFun(){
        this.checkbox.addEventListener('change', e =>{
            e.preventDefault()
            if(this.checkbox.checked){
                this.checkboxTitle.textContent = 'Incoming'
            } else {
                this.checkboxTitle.textContent = 'Outgoing'

            }
        })
    }

    get outgoingTitle() {
        return this.input.value
    }

    get outgoingTime() {
        return this.input2.value
    }

    resetInput() {
        this.input.value = ''
        this.input2.value = ''
    }

    displayOutgoings(outgoings){
        while (this.outgoingList.firstChild ) {
            this.outgoingList.removeChild(this.outgoingList.firstChild)
            
        }
        
        if(outgoings.length === 0){
            const def = this.createElement('p')
            def.textContent = 'No outgoings planned'
            this.outgoingList.append(def)
        } else {
            outgoings.forEach(outgoing => {
                const li = this.createElement('li')
                li.id = outgoing.id

                const complete = this.createElement('button', 'done')
                complete.textContent = "Done"

                const span = this.createElement('span')
                span.contentEditable = true
                span.classList.add('editable')

                if(outgoing.complete) {
                    li.style.backgroundColor = 'lime';
                }
                span.textContent = outgoing.title + " " + outgoing.time
                li.append(span,complete)

                this.outgoingList.append(li)
            })
        }
        
    }

    displayIncomings(incomings){
        while (this.incomingsList.firstChild) {
            this.incomingsList.removeChild(this.incomingsList.firstChild)
            
        }

        if(incomings.length === 0){
            const defInc = this.createElement('p')
            defInc.textContent = 'No incomings planned'
            this.incomingsList.append(defInc)
        } else {
            incomings.forEach(incoming => {
                const liInc = this.createElement('li')
                liInc.id = incoming.id
                const completeInc = this.createElement('button', 'doneInc')
                completeInc.textContent = "Done"
                const span = this.createElement('span')
                span.contentEditable = true
                span.classList.add('editable')
                if(incoming.complete) {
                    liInc.style.backgroundColor = 'lime'
                }
                span.textContent = incoming.title + " " + incoming.time
                liInc.append(span,completeInc)
                this.incomingsList.append(liInc)
            })
        }
    }

    bindAddOutgoing(handler) {
        this.form.addEventListener('submit', event => {
            event.preventDefault()

            if (this.outgoingTitle){
                handler(this.outgoingTitle, this.outgoingTime)
                this.resetInput()

            }
        })
    }


    bindToggleOutgoing(handler) {
        this.outgoingList.addEventListener('click', event => {
            if (event.target.className === 'done') {
                const id = parseInt(event.target.parentElement.id)

                handler(id)
            }
        })
    }
}

class Controller{
    constructor(model, view) {
        this.model = model
        this.view = view
        this.view.bindAddOutgoing(this.handleAddOutgoing)
        this.view.bindToggleOutgoing(this.handleToggleOutgoing)
        this.view.checkboxFun(this.onCheckboxChecked)
        this.model.bindOutgoingsChanged(this.onOutgoingsChanged)
        this.model.bindIncomingsChanged(this.onIncomingsChanged)
    
        this.onOutgoingsChanged(this.model.outgoings)
        this.onIncomingsChanged(this.model.incomings)

    }
    onOutgoingsChanged = (outgoings) => {
        this.view.displayOutgoings(outgoings)
    }

    onIncomingsChanged = (incomings) => {
        this.view.displayIncomings(incomings)
    }

    handleAddOutgoing = (title, time) => {
        this.model.addOutgoing(title,time)
    }

    /*handleEditOutgoing = (id, title, time) => {
        this.model.editOutgoing(id, title, time)
    }*/

    onCheckboxChecked = () => {
        this.view.checkboxFun()
    }

    handleToggleOutgoing = (id) => {
        this.model.toggleOutgoing(id)
      }
    
}

const app = new Controller(new Model(), new View())