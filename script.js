window.onload = function () {

    Vue.component('priority-select', {
        data: function () {
            return {
                noPriority: { type: Boolean, default: true },
                isLow: { type: Boolean, default: false },
                isMed: { type: Boolean, default: false },
                isHigh: { type: Boolean, default: false },
                priorityOptions: [
                    {
                        'priority': 'None',
                        'class': 'no-priority'
                    },
                    {
                        'priority': 'Low',
                        'class': 'low-priority'
                    },
                    {
                        'priority': 'Medium',
                        'class': 'med-priority',
                    },
                    {
                        'priority': 'High',
                        'class': 'high-priority'
                    }
                ]
            }
        },

        props: {
            'value': {
                type: String,
                required: true,
                validator: function (value) {
                    return ['none', 'low', 'medium', 'high'].indexOf(value.toLowerCase()) !== -1;
                }
            }
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
            <option 
                v-for="option in priorityOptions" 
                :class="option.class">
            {{option.priority}}
            </option>
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
            },
        }
    });

    new Vue({
        el: "#to-do-list",
        data: {
            items: [],
            filterBy: 'All',
            showFilter: false,
            showSettings: false,
            newItem: {
                "text": "",
                "id": 0,
                "priority": "None",
                "completed": false
            },
            sortAlphaAscend: { 'value': false },
            sortAlphaDescend: { 'value': false },
            sortPriorityAscend: { 'value': false },
            sortPriorityDescend: { 'value': false },
            sortIncompleteFirst: { 'value': true }
        },

        created: function () {
            // adds a default to-do item
            this.items.unshift({
                "id": this.newItem.id++,
                "text": "Make a to-do list",
                "completed": false,
                "priority": "High"
            });
        },

        methods: {
            addNewItem: function () {
                if (this.newItem.text !== "") {
                    this.items.unshift({
                        "id": this.newItem.id++,
                        "text": this.newItem.text,
                        "priority": this.newItem.priority,
                        "completed": this.newItem.completed
                    });

                    this.newItem.text = "";
                }
            },

            removeItemById: function (id) {
                let index = this.items.findIndex(item => item.id === id);
                this.items.splice(index, 1);
            },

            sortByAlphaAscending: function () {
                this.items.sort(function (item1, item2) {
                    if (item1.text.toLowerCase() < item2.text.toLowerCase()) {
                        return -1;
                    } else if (item1.text.toLowerCase() > item2.text.toLowerCase()) {
                        return 1;
                    }

                    return 0;
                });
            },

            sortByAlphaDescending: function () {
                this.items.sort(function (item1, item2) {
                    if (item1.text.toLowerCase() > item2.text.toLowerCase()) {
                        return -1;
                    } else if (item1.text.toLowerCase() < item2.text.toLowerCase()) {
                        return 1;
                    }

                    return 0;
                });
            },

            sortByAscendingPriority: function () {
                this.items.sort(function (item1, item2) {

                    if (item1.priority == item2.priority) {
                        return 0;
                    } else if (item1.priority === 'None') {
                        return -1;
                    } else if (item2.priority === 'None') {
                        return 1;
                    } else if (item2.priority === 'High') {
                        return -1;
                    } else if (item1.priority === 'High') {
                        return 1;
                    } else if (item1.priority === 'Low' && item2.priority === 'Medium') {
                        return -1;
                    } else if (item1.priority === 'Medium' && item2.priority === 'Low') {
                        return 1;
                    }

                    return 0;
                });
            },

            sortByDescendingPriority: function () {
                this.items.sort(function (item1, item2) {

                    if (item1.priority === item2.priority) {
                        return 0;
                    } else if (item1.priority === 'None') {
                        return 1;
                    } else if (item2.priority === 'None') {
                        return -1;
                    } else if (item2.priority === 'High') {
                        return 1;
                    } else if (item1.priority === 'High') {
                        return -1;
                    } else if (item1.priority === 'Low' && item2.priority === 'Medium') {
                        return 1;
                    } else if (item1.priority === 'Medium' && item2.priority === 'Low') {
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
            },

            sort: function () {
                if (this.sortAlphaAscend.value) {
                    this.sortByAlphaAscending();
                } else if (this.sortAlphaDescend.value) {
                    this.sortByAlphaDescending();
                }

                if (this.sortPriorityAscend.value) {
                    this.sortByAscendingPriority();
                } else if (this.sortPriorityDescend.value) {
                    this.sortByDescendingPriority();
                }

                if (this.sortIncompleteFirst.value) {
                    this.sortByCompleted();
                }
            },

            flipSortValue: function (val1, val2) {
                val1.value = !val1.value;
                val2.value = (val1.value && val2.value) ? !val2.value : val2.value;
            }
        },

        computed: {
            incompleteCount: function () {
                return this.items.filter(item => !item.completed).length;
            },

            filteredItems: function () {
                let filter = this.filterBy.toLowerCase();

                this.sort();

                return this.items.filter(function (item) {
                    switch (filter) {
                        case 'completed':
                            return item.completed;
                        case 'incomplete':
                            return !item.completed;
                        case 'all':
                            return true;
                        default:
                            return;
                    }
                });
            },
        }
    });
}
