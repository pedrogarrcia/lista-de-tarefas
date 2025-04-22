const Main = {

    tasks: [],

    init: function() {
        //importar as propriedades
        this.cacheSelectors()
        this.bindEvents()
        this.getStoraged()
        this.buildTasks()
    },

    // Seleciona o DOM
    cacheSelectors: function() {
        //importa o DOM
        this.$checkButtons = document.querySelectorAll('.check')
        this.$inputTask = document.querySelector('#inputTask')
        this.$list = document.querySelector('#list')
        this.$removeButtons = document.querySelectorAll('.remove')

    },

    //Vincular os eventos com as funções
    bindEvents: function () {
        const self = this
        
        this.$checkButtons.forEach(function(button){
            button.onclick = self.Events.checkButton_click.bind(self)
        })

        this.$inputTask.onkeypress = self.Events.input_Keypress.bind(this)

        this.$removeButtons.forEach(function(button){
            button.onclick = self.Events.removeButton_click.bind(self)
        })  
    },

    // Pegando as tasks e colocando no array tasks como objeto
    getStoraged: function() {
      const tasks = localStorage.getItem('tasks')

      if(tasks) {
        this.tasks = JSON.parse(tasks)
      }else {
        localStorage.setItem('tasks', JSON.stringify([]))
      }

    },

    //Gera o HTML
    getTaksHtml: function(task, isDone) {
        return  `
        <li class= "${isDone ? 'done' : ''}" data-task="${task}">
            <div class="check"></div>
            <label class="task">
                ${task}
            </label>
            <button class="remove" ></button>
        </li>
    `
    },


    // Imprimir || Ele retorna as lista do localStorage quando recarregar a página 
    buildTasks : function() {
        let html = ''   

        this.tasks.map(item => {
            html += this.getTaksHtml( item.task, item.done)
        })

        this.$list.innerHTML = html

        this.cacheSelectors()
        this.bindEvents()
    },

    //funções
    Events: {


        checkButton_click: function(e) {
            const li = e.target.parentElement
            const value = li.dataset['task']
            const isDone = li.classList.contains('done')

            const newTasksState = this.tasks.map(item => {
                if(item.task === value) {
                    item.done = !isDone
                }
                return item
            })

            localStorage.setItem('tasks', JSON.stringify(newTasksState))

            this.tasks = newTasksState


            if(!isDone) {
                return li.classList.add('done')
            }

            li.classList.remove('done')
        },

        input_Keypress: function(e) {
            const key = e.key
            const value = e.target.value
            const isDone = false

            if( key === 'Enter') {

                e.target.value = ''

                 this.$list.innerHTML += this.getTaksHtml(value, isDone)

                 this.cacheSelectors()
                 this.bindEvents()


                  const savedTasks = localStorage.getItem('tasks')
                  const savedTasksObj = JSON.parse(savedTasks) || []

                const obj = [
                    {task: value,
                      done: isDone  
                    },// está como false!
                   ...savedTasksObj,
                ]

                this.tasks = obj
                localStorage.setItem('tasks', JSON.stringify(obj))
            }
        },

        removeButton_click: function(e) {
            const li = e.target.parentElement
            const value = li.dataset['task']


            const newTasksState = this.tasks.filter(item => {
                return item.task !== value
            })

            localStorage.setItem('tasks', JSON.stringify(newTasksState))
            this.tasks = newTasksState


            setTimeout(function(){
                li.classList.add('hidden')
            },300)
        }
    }


}

Main.init()