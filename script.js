window.onload = function () {

    Vue.component('priority-select', {
        data: function () {
            return {
                noPriority: { type: Boolean, default: true },
                isLow: { type: Boolean, default: false },
                isMed: { type: Boolean, default: false },
                isHigh: { type: Boolean, default: false }
            }
        },
        props: {
            'value': { required: true }
        },
        template: `<select
        :class="[
            {'no-priority': noPriority}, 
            {'low-priority': isLow}, 
            {'med-priority': isMed}, 
            {'high-priority': isHigh}
        ]" 
        :value="value" 
        @input="$emit('input', $event.target.value)" 
        tabindex="0">
            <option class="no-priority" selected>None</option>
            <option class="low-priority">Low</option>
            <option class="med-priority">Medium</option>
            <option class="high-priority">High</option>
            </select>`,
        watch: {
            value: function () {
                this.setTextColor();
            }
        },
        created: function () {
            this.setTextColor();
        },
        methods: {
            setTextColor() {
                this.noPriority = this.value == "None" ? true : false;
                this.isLow = this.value == "Low" ? true : false;
                this.isMed = this.value == "Medium" ? true : false;
                this.isHigh = this.value == "High" ? true : false;
            }
        }
    });

    new Vue({
        el: "#to-do-list",
        data: {
            items: [],
            newItemText: "",
            newItemPriority: "None",
            newItemId: 0,
            filterBy: 'All',
            showFilter: false,
            showSettings: false,
            moveItemsToBottom: true
        },

        created: function () {
            // sets a default to-do item
            this.items.unshift({
                "id": this.newItemId++,
                "text": "Make a to-do list",
                "completed": false,
                "priority": "High"
            });
        },

        methods: {
            addNewItem: function () {
                if (this.newItemText != "") {
                    this.items.unshift({
                        "id": this.newItemId++,
                        "text": this.newItemText,
                        "completed": false,
                        "priority": this.newItemPriority
                    });

                    this.newItemText = "";
                }
            },

            removeItemById: function (id) {
                let index = this.items.findIndex(item => item.id === id);
                this.items.splice(index, 1);
            },

            changeCompleted: function (item) {

                if (item.completed) {
                    item.completed = false;
                    if (this.moveItemsToBottom) {
                        this.moveToFront(item);
                    }
                } else {
                    item.completed = true;
                    if (this.moveItemsToBottom) {
                        this.moveToEnd(item);
                    }
                }

                // item.completed = item.completed ? false : true;
            },

            moveToEnd: function (item) {
                this.removeItemById(item.id);
                this.items.push(item);
            },

            moveToFront: function (item) {
                this.removeItemById(item.id);
                this.items.unshift(item);
            },

            flipBoolean(bool) {
                return bool = bool ? false : true;
            },

            sortAlphabetically: function () {
                this.items.sort(function (item1, item2) {
                    if (item1.text.toLowerCase() < item2.text.toLowerCase()) {
                        return -1;
                    } else if (item1.text.toLowerCase() > item2.text.toLowerCase()) {
                        return 1;
                    }

                    return 0;
                });
            },

            sortByAlphaReversed: function () {
                this.items.sort(function (item1, item2) {
                    if (item1.text.toLowerCase() > item2.text.toLowerCase()) {
                        return -1;
                    } else if (item1.text.toLowerCase() < item2.text.toLowerCase()) {
                        return 1;
                    }

                    return 0;
                });
            },

            sortByLowestPriority: function () {
                this.items.sort(function (item1, item2) {

                    if (item1.priority == item2.priority) {
                        return 0;
                    } else if (item1.priority == 'None') {
                        return -1;
                    } else if (item2.priority == 'None') {
                        return 1;
                    } else if (item2.priority == 'High') {
                        return -1;
                    } else if (item1.priority == 'High') {
                        return 1;
                    } else if (item1.priority == 'Low' && item2.priority == 'Medium') {
                        return -1;
                    } else if (item1.priority == 'Medium' && item2.priority == 'Low') {
                        return 1;
                    }

                    return 0;
                });
            },

            sortByHighestPriority: function () {
                this.items.sort(function (item1, item2) {

                    if (item1.priority == item2.priority) {
                        return 0;
                    } else if (item1.priority == 'None') {
                        return 1;
                    } else if (item2.priority == 'None') {
                        return -1;
                    } else if (item2.priority == 'High') {
                        return 1;
                    } else if (item1.priority == 'High') {
                        return -1;
                    } else if (item1.priority == 'Low' && item2.priority == 'Medium') {
                        return 1;
                    } else if (item1.priority == 'Medium' && item2.priority == 'Low') {
                        return -1;
                    }

                    return 0;
                });
            },

            sortByCompleted: function () {
                this.items.sort(function (item1, item2) {
                    if (item1.completed && !item2.completed) {
                        return 1;
                    } else if (!item1.completed && item2.completed) {
                        return -1;
                    }

                    return 0;
                });
            }
        },

        computed: {
            incompleteCount: function () {
                let incompleteCount = 0;

                this.items.forEach(item => {
                    if (!item.completed) {
                        incompleteCount++;
                    }
                });

                return incompleteCount;
            },

            filteredItems: function () {
                let filteredItems = [];

                if (this.filterBy == 'Completed' || this.filterBy == 'Incomplete') {
                    let filter = this.filterBy == 'Completed' ? true : false;

                    this.items.forEach(item => {
                        if (item.completed === filter) {
                            filteredItems.push(item);
                        }
                    });

                    return filteredItems;

                }
                return this.items;
            }
        }
    });



    function dragstart_handler(event) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);

        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html',)

    }

    function dragover_handerl(event) {

    }

    function drop_handler(event) {

    }
}