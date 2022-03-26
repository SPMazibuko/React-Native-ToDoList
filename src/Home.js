import React, { useState, useEffect } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { API, Auth, graphqlOperation, input } from "aws-amplify";
import { listTodos } from "./graphql/queries";
import { createTodo, updateTodo, deleteTodo } from "./graphql/mutations";

const AddTodoModal = ({ modalVisible, setModalVisible }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // add todo items from the modal
  const addTodo = async () => {
    try {
      const input = {
        name,
        description,
        isComplete: false,
      };
      const response = await API.graphql(
        graphqlOperation(createTodo, { input })
      );
      console.log(response);
    } catch (e) {
      console.log(e);
    }
    setName("");
    setDescription("");
  };

  function closeModal() {
    setModalVisible(false);
  }

  return (
    <Modal
      animationType="fade"
      onRequestClose={closeModal}
      transparent
      visible={modalVisible}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalInnerContainer}>
          <Pressable onPress={closeModal} style={styles.modalDismissButton}>
            <Text style={styles.modalDismissText}>Close</Text>
          </Pressable>
          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="Name"
            style={styles.modalInput}
            required
          />
          <TextInput
            value={description}
            onChangeText={(text) => setDescription(text)}
            placeholder="Description"
            style={styles.modalInput}
          />
          <Pressable onPress={addTodo} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Save Todo</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  // fetch todo list items from the database
  const fetchTodos = async () => {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      setTodos(todoData.data.listTodos.items);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchTodos();
  }, []);

  // delete todo list items
  async function onDeleteTodo({ id }) {
    try {
      const newTodoArray = todos.filter((todo) => todo.id !== id);
      setTodos(newTodoArray);
      await API.graphql(graphqlOperation(deleteTodo, { input: { id } }));
    } catch (e) {
      console.log(e);
    }
  }

  // update the todo list items
  async function setComplete(updateValue, { id }) {
    try {
      const updateTodoData = await API.graphql(
        graphqlOperation(updateTodo, {
          input: {
            id,
            isComplete: updateValue,
          },
        })
      );
      setTodos(updateTodoData.data.updateTodo);
    } catch (e) {
      console.log(e);
    }
  }

  const renderItem = ({ item }) => (
    <Pressable
      onLongPress={() => {
        onDeleteTodo(item);
      }}
      onPress={() => {
        setComplete(!item.isComplete, item);
      }}
      style={styles.todoContainer}
    >
      <Text>
        <Text style={styles.todoHeading}>{item.name}</Text>
        {`\n${item.description}`}
      </Text>
      <Text
        style={[styles.checkbox, item.isComplete && styles.completedCheckbox]}
      >
        {item.isComplete ? "✓" : ""}
      </Text>
    </Pressable>
  );

  return (
    <FlatList
      data={todos}
      keyExtractor={({ id }) => id}
      renderItem={renderItem}
    />
  );
};

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState("");
  //Fetch current authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        setUser(userData);
        console.log(userData);
      } catch (e) {
        console.log(e);
      }
    };
    fetchUser();
  }, []);
  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Welcome Sifiso</Text>
      </View>
      <TodoList />
      <Pressable
        onPress={() => {
          setModalVisible(true);
        }}
        style={[styles.buttonContainer, styles.floatingButton]}
      >
        <Text style={styles.buttonText}>+ Add Todo</Text>
      </Pressable>
      <AddTodoModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#00000091",
    paddingTop: Platform.OS === "ios" ? 44 : 0,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    paddingVertical: 16,
    textAlign: "center",
  },
  todoContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 2,
    elevation: 4,
    flexDirection: "row",
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 8,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  todoHeading: {
    fontSize: 20,
    fontWeight: "600",
  },
  checkbox: {
    borderRadius: 2,
    borderWidth: 2,
    fontWeight: "700",
    height: 20,
    marginLeft: "auto",
    textAlign: "center",
    width: 20,
  },
  completedCheckbox: {
    backgroundColor: "#000",
    color: "#fff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    padding: 16,
  },
  buttonContainer: {
    alignSelf: "center",
    backgroundColor: "#00000085",
    borderRadius: 99,
    paddingHorizontal: 8,
  },
  floatingButton: {
    position: "absolute",
    bottom: 44,
    elevation: 6,
    shadowOffset: {
      height: 4,
      width: 1,
    },
    shadowRadius: 4,
  },
  modalContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  modalInnerContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    justifyContent: "center",
    padding: 16,
  },
  modalInput: {
    borderBottomWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  modalDismissButton: {
    marginLeft: "auto",
  },
  modalDismissText: {
    fontSize: 20,
    fontWeight: "700",
  },
});

export default Home;
