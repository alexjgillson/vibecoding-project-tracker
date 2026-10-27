import { useState, useEffect } from 'react';
import './index.css'
import {createPortal} from "react-dom";
/**
 * Vibecoding Project Tracker — starter scaffold.
 *
 * This file is intentionally almost empty. The boilerplate (Vite, React,
 * Tailwind) is configured for you, plus a few shared constants and a
 * localStorage helper. Everything visible on screen, you build.
 *
 * Where to start (build sequence in Phase 3):
 *   - M4  data-model    : render the four columns and the task cards below.
 *   - M5  crud-modal    : add the "+" button modal and the edit-on-click modal.
 *   - M6  tag-style     : feature vs. bug color coding (uses DESIGN.md §2 colors).
 *   - M7  task-owner    : assignee badge + "Hand off to..." dropdown.
 *   - M8  due-tint      : color cards by due date (uses DESIGN.md §2 due-state colors).
 *   - M9  context       : a curated Context briefing field on the modal.
 *   - M10 copy-prompt   : a "Copy as Prompt Context" button that serializes the task + context.
 *   - M11 anchors       : the Anchor Board above the Kanban.
 *   - M12 secret-sauce  : the one open-ended thing that makes your tracker yours.
 *
 * Search the file for `TODO M<n>`  to find the right hook for each milestone.
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'feature'|'bug'} type
 * @property {'todo'|'in-progress'|'review'|'done'} status
 * @property {string} assignee
 * @property {string|null} dueDate     ISO 'YYYY-MM-DD'
 * @property {string} createdDate      ISO 'YYYY-MM-DD'
 */

let nextId = 3;
const defaultTasks = [
  {
    id: '0',
    title: 'Task 1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    type: 'Feature',
    stage: 'todo',
    assignee: 'Alex',
    dueDate: null,
    createdDate: '2026-10-25',
    open: false
  },
  {
    id: '1',
    title: 'Task 2',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    type: 'Feature',
    stage: 'in-progress',
    assignee: 'Alex',
    dueDate: null,
    createdDate: '2026-10-25',
    open: false
  },
  {
    id: '2',
    title: 'Task 3',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    type: 'Bug',
    stage: 'in-progress',
    assignee: 'Alex',
    dueDate: null,
    createdDate: '2026-10-25',
    open: false
  }
]
// The four columns of the board, in render order.
// Use these IDs everywhere — do not invent new ones.
export const STAGES = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

// Replace these placeholders with the three names from PRD §8 before M4.
// They become the only valid values for `Task.assignee`.
const defaultTeam = ['Alex', 'Ben', 'Charley'];
/**
 * A tiny localStorage hook — survives reloads, no library needed.
 *
 * Usage:
 *   const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', []);
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or private-mode error — silently ignore for hackathon */
    }
  }, [key, value]);

  return [value, setValue];
}

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="relative outline outline-black outline-4 -outline-offset-4" style={{
          background: 'white',
          padding: '20px',
        }}>
          {children}
          <button className="absolute top-4 right-4 rounded-full justify-self-end outline" onClick={onClose}>&nbsp;&nbsp;X&nbsp;&nbsp;</button>
        </div>
      </div>,
      document.body
  );
}

export default function App() {
  // TODO M4 data-model:
  //   const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', [/* 3-4 seed tasks */]);
  // TODO M5 crud-modal:
  //   const [editing, setEditing] = useState(null);
  //
  // TODO M11 anchors:
  //   const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', [...]);

  const [currentUser, setCurrentUser] = useLocalStorage('vibetracker.currentUser', 'Alex');
  const [TEAM, setTeam] = useLocalStorage('vibetracker.team', defaultTeam);
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', defaultTasks);
  const [showAllTasks, setShowAllTasks] = useLocalStorage('vibetracker.userTasksOnly', false);
  function newTask(stage){
    setTasks([
        ...tasks,
        {
          id: (nextId++).toString(),
          title: 'Title',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          type: 'Feature',
          stage: stage,
          assignee: currentUser,
          dueDate: "",
          createdDate: (new Date).toLocaleDateString('en-CA'),
          open: true,
        }]
    )
  }
  function changeModal(id,shouldOpen){
    const newTasks = tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          open: shouldOpen,
        };
      } else {
        return task;
      }
    })
    setTasks(newTasks);
  }
  function changeStage(id,stageIndex,isLeft){
    const newTasks = tasks.map(task => {
      if (task.id === id) {
        let newStage = '';
        STAGES.map((stage,index) => {
          console.log(index === (stageIndex - 1))
          if (isLeft){
            if (index === (stageIndex - 1)){
              newStage = stage.id
            }
          } else {
            if (index === (stageIndex + 1)){
              newStage = stage.id
            }
          }
        })
        if (newStage === ''){
          return task;
        }
        return {
          ...task,
          stage: newStage,
        };
      }
      return task;
    })
    setTasks(newTasks);
  }
  function handleSubmit(e) {
    e.preventDefault()
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const newTasks = tasks.map(task => {
      if (task.id === formJson.id) {
        return formJson;
      } else {
        return task;
      }
    })
    setTasks(newTasks);
  }

  return (
    <div className="min-h-svh p-6 font-mono font-bold">
      <header className="relative mb-6 p-6 grid grid-cols-4">

        <div className="col-span-3">
          <h1 className="text-2xl font-bold text-slate-900">
            Kanban Project Tracker
          </h1>
        </div>
        <div className="grid-cols-1 flex justify-evenly">
          <button onClick={()=>setShowAllTasks(false)}>My Tasks</button>
          <button onClick={()=>setShowAllTasks(true)}>All Tasks</button>
          <button onClick={()=>setShowAllTasks(true)}>Edit Team</button>
          <div className="grid-cols-2 flex justify-end">
            <select className="text-2xl content-center font-bold text-slate-900" defaultValue={currentUser} onChange={e => setCurrentUser(e.target.value)}>
              {TEAM.map (user =>
                  <option value={user}>&nbsp;{user}&nbsp;</option>
              )}
            </select>
          </div>
        </div>

      </header>

      {/* TODO M11 anchors: render the Anchor Board (Presentation / Demo / Report / Documentation) above the board. */}
      {/*<main className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400">*/}

      <main className="grid min-h-svh grid-cols-2 md:grid-cols-4 outline-4 outline outline-black">
          {STAGES.map (((stage,stageIndex) =>
            <div className="column col-span-1 outline-2 outline outline-black hover:bg-red-100 gap-4" key={stage.id}>
              <div className="relative w-full outline text-center">
                <h1>{stage.label}</h1>
                <button className="absolute top-0 right-0 justify-self-end outline gap-20" onClick={() => newTask(stage.id)}>&nbsp;New&nbsp;</button>
              </div>
              <div className="p-4" key={stage.id}>
                {tasks.filter(task => task.stage === stage.id && (showAllTasks || task.assignee === currentUser)).map(foundTask => (
                  <div key={foundTask.id} className="relative aspect-square min-h-fit p-4 hover:bg-red-400 overflow-hidden">
                    <h1>{foundTask.title}</h1>
                    <p className="overflow-hidden text-wrap truncate max-h-28 md:max-h-20 lg:max-h-32 xl:max-h-48 2xl:max-h-64">{foundTask.description}</p>
                    <button className="absolute bottom-4 left-4 md:left-1 lg:left-4 rounded-full justify-self-end outline gap-20" onClick={() => changeStage(foundTask.id, stageIndex,true)}>&nbsp;&lt;&nbsp;</button>
                    <button className="absolute bottom-4 right-24 rounded-full justify-self-end outline gap-20" onClick={() => changeModal(foundTask.id, true)}>&nbsp;+&nbsp;</button>
                    <button className="absolute bottom-4 right-14 rounded-full justify-self-end outline gap-20" onClick={() => {
                      if (confirm("Delete " + foundTask.title + "?")) {
                        setTasks(tasks.filter(task => task.id !== foundTask.id))}
                      }}>&nbsp;-&nbsp;</button>
                    <button className="absolute bottom-4 right-4 rounded-full justify-self-end outline gap-20" onClick={() => changeStage(foundTask.id, stageIndex,false)}>&nbsp;&gt;&nbsp;</button>
                    <Modal isOpen={foundTask.open} onClose={() => changeModal(foundTask.id, false)}>
                      <form onSubmit={handleSubmit}>
                        <input type="hidden" name="id" value={foundTask.id}></input>
                        <input
                          type="text"
                          name="title"
                          defaultValue={foundTask.title}
                        /><br></br>
                        <textarea
                            name="description"
                            defaultValue={foundTask.description}
                            className="w-full h-64 text-wrap"
                        /><br></br>
                        <div className="flex justify-evenly gap-2">
                        <select
                            name="type"
                            defaultValue={foundTask.type}
                        >
                          <option value="Feature">Feature</option>
                          <option value="Bug">Bug</option>
                        </select>
                        <select
                            name="stage"
                            defaultValue={foundTask.stage}
                        >
                          {STAGES.map (aStage =>
                              <option value={aStage.id}>{aStage.label}</option>
                          )}
                        </select>
                        <select
                            name="assignee"
                            defaultValue={foundTask.assignee}
                        >
                          {TEAM.map (assignee =>
                              <option value={assignee}>{assignee}</option>
                          )}
                        </select>
                        <input
                            type="text"
                            name="dueDate"
                            defaultValue={foundTask.dueDate}
                        />
                        <input
                            type="text"
                            name="createdDate"
                            defaultValue={foundTask.createdDate}
                        />
                        <input type="submit"/>
                        </div>
                      </form>
                    </Modal>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </main>
    </div>
  );
}
