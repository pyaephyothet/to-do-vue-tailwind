<template>
  <div class="container flex justify-center items-center h-screen">
    <div class="form p-5 border-2 border-solid border-primary-100">
      <h1 class="text-lg font-bold">todo</h1>
      <!--  todo_input  -->
      <form
        class="mt-3 flex items-center justify-between"
        @submit.prevent="addTodo"
      >
        <input
          v-model="state.newTodo"
          type="text"
          placeholder="Add todo..."
          class="w-96 p-3 border border-primary-100 focus:outline-none"
        />
        <button
          type="submit"
          class="bg-primary-100 text-white font-bold py-3 px-4"
        >
          <svg
            width="25px"
            height="25px"
            viewBox="0 0 24 24"
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z"
              fill="#fff"
            />
          </svg>
        </button>
      </form>
      <!--  todo_filters  -->
      <div class="flex mt-3 justify-between gap-2">
        <button
          class="filter_btn"
          :class="{ active: state.filter === 'all' }"
          @click="setFilter('all')"
        >
          All
        </button>
        <button
          class="filter_btn"
          :class="{ active: state.filter === 'active' }"
          @click="setFilter('active')"
        >
          Active
        </button>
        <button
          class="filter_btn"
          :class="{ active: state.filter === 'completed' }"
          @click="setFilter('completed')"
        >
          Completed
        </button>
      </div>
      <!--  todo_tasks  -->
      <ul class="pl-0 mt-4">
        <li v-for="todo in filteredTodos" :key="todo.id" class="task">
          <input
            type="checkbox"
            class="box w-5 h-5 mr-3"
            v-model="todo.completed"
            @change="toggleTodoCompleted(todo.id, $event.target.checked)"
          />
          <input
            type="text"
            v-model="todo.text"
            :readonly="todo.id !== state.editingTodoId"
            class="todo_task"
            @dblclick="startEditing(todo.id)"
            @blur="finishEditing(todo.id)"
            @keyup.enter="finishEditing(todo.id)"
            @keyup.esc="reloadOnEscapeKey()"
            :class="{ editing: todo.id === state.editingTodoId }"
          />
          <button class="trash-btn" @click="deleteTodoById(todo.id)">
            <svg
              width="22px"
              height="22px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="Interface / Trash_Full">
                <path
                  id="Vector"
                  d="M14 10V17M10 10V17M6 6V17.8C6 18.9201 6 19.4798 6.21799 19.9076C6.40973 20.2839 6.71547 20.5905 7.0918 20.7822C7.5192 21 8.07899 21 9.19691 21H14.8031C15.921 21 16.48 21 16.9074 20.7822C17.2837 20.5905 17.5905 20.2839 17.7822 19.9076C18 19.4802 18 18.921 18 17.8031V6M6 6H8M6 6H4M8 6H16M8 6C8 5.06812 8 4.60241 8.15224 4.23486C8.35523 3.74481 8.74432 3.35523 9.23438 3.15224C9.60192 3 10.0681 3 11 3H13C13.9319 3 14.3978 3 14.7654 3.15224C15.2554 3.35523 15.6447 3.74481 15.8477 4.23486C15.9999 4.6024 16 5.06812 16 6M16 6H18M18 6H20"
                  stroke="#dc2626"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>
          </button>
        </li>
      </ul>
      <!--  todo_count  -->
      <span id="activeCount" class="text-primary-100"
        >{{ activeCount }} item{{ activeCount !== 1 ? "s" : "" }} left</span
      >
      <!--  todo_action  -->
      <div class="flex mt-3 justify-between">
        <button
          class="action_btn"
          @click="toggleAll"
          :class="{ disabled: state.todos.length === 0 }"
        >
          {{ checkAllText }}
        </button>
        <button
          class="action_btn"
          @click="clearCompleted"
          :class="{
            disabled: completedCount === 0 || state.todos.length === 0,
          }"
        >
          Clear Completed
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from "vue";

const state = reactive({
  todos: [],
  newTodo: "",
  filter: "all",
  editingTodoId: null,
});

const loadTodos = () => {
  if (localStorage.getItem("todos")) {
    state.todos = JSON.parse(localStorage.getItem("todos"));
  }
};

const saveTodos = () => {
  localStorage.setItem("todos", JSON.stringify(state.todos));
};

const updateTodos = () => {
  saveTodos();
};

onMounted(loadTodos);

const addTodo = () => {
  if (state.newTodo.trim() !== "") {
    const todo = {
      id: Date.now(),
      text: state.newTodo.trim(),
      completed: false,
    };
    state.todos.push(todo);
    state.newTodo = "";
  }
  updateTodos();
};

const setFilter = (filter) => {
  state.filter = filter;
};

const toggleTodoCompleted = (id, checked) => {
  const todo = state.todos.find((todo) => todo.id === id);
  if (todo) {
    todo.completed = checked;
  }
  updateTodos();
};

const deleteTodoById = (id) => {
  state.todos = state.todos.filter((todo) => todo.id !== id);
  updateTodos();
};

const startEditing = (id) => {
  state.editingTodoId = id;
};

const finishEditing = (id) => {
  state.editingTodoId = null;
  const todo = state.todos.find((todo) => todo.id === id);
  if (todo) {
    todo.text = todo.text.trim();
    if (todo.text === "") {
      window.location.reload();
      return;
    }
  }
  updateTodos();
};

const reloadOnEscapeKey = () => {
  window.location.reload();
};

const toggleAll = () => {
  const allCompleted = state.todos.every((todo) => todo.completed);
  state.todos.forEach((todo) => {
    todo.completed = !allCompleted;
  });
};

const clearCompleted = () => {
  state.todos = state.todos.filter((todo) => !todo.completed);
  updateTodos();
};

const activeCount = computed(() => {
  return state.todos.filter((todo) => !todo.completed).length;
});

const filteredTodos = computed(() => {
  if (state.filter === "active") {
    return state.todos.filter((todo) => !todo.completed);
  }
  if (state.filter === "completed") {
    return state.todos.filter((todo) => todo.completed);
  }
  return state.todos;
});

const completedCount = computed(() => {
  return state.todos.filter((todo) => todo.completed).length;
});

const checkAllText = computed(() => {
  return state.todos.every((todo) => todo.completed)
    ? "Uncheck All"
    : "Check All";
});
</script>
