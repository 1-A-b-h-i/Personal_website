import React, { useState, useRef } from 'react';
import { FaCopy, FaCheck, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import '../components/Clipboard/Clipboard.css';

const ClipboardPage = () => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedCodes, setExpandedCodes] = useState({});
  const textAreaRef = useRef(null);

  const copyToClipboard = (text, index) => {
    // Create a temporary textarea element to copy from
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      // Try the modern clipboard API first
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopiedIndex(index);
          setTimeout(() => setCopiedIndex(null), 2000);
        })
        .catch(() => {
          // Fallback to document.execCommand
          const successful = document.execCommand('copy');
          if (successful) {
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
          } else {
            console.error('Failed to copy text');
          }
        });
    } catch (err) {
      // Final fallback
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          setCopiedIndex(index);
          setTimeout(() => setCopiedIndex(null), 2000);
        } else {
          console.error('Failed to copy text');
        }
      } catch (err) {
        console.error('Failed to copy text', err);
      }
    } finally {
      // Clean up
      document.body.removeChild(textarea);
    }
  };

  const toggleCodeExpansion = (index) => {
    setExpandedCodes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const notebookData = [
    {
      type: 'markdown',
      content: '##N-Queen'
    },
    {
      type: 'code',
      content: `def solve_nqueens(board_size):
    def is_safe(board, row, col):
        for i in range(row):
            if board[i] == col or abs(board[i] - col) == row - i:
                return False
        return True

    def solve_nqueens_util(board, row, solutions):
        if row == board_size:
            solutions.append(board.copy())
            return
        for col in range(board_size):
            if is_safe(board, row, col):
                board[row] = col
                solve_nqueens_util(board, row+1, solutions)
    solutions = []
    board = [0]*board_size
    solve_nqueens_util(board,0,solutions)
    return solutions

if __name__ =="__main__":
    try:
        board_size = int(input("Enter chessboard size : "))
        if board_size <= 0:
            print("Board size must be a positive integer")
        else:
            solutions = solve_nqueens(board_size)
            print(f"Found {len(solutions)} solutions : ")
            for i, solution in enumerate(solutions):
                print(f"Solution {i+1}: {solution}")
    except ValueError:
        print("Invalid Output")`
    },
    {
      type: 'markdown',
      content: '##M-Coloring'
    },
    {
      type: 'code',
      content: `def is_safe(graph, color, vertex, c):
    for i in range(len(graph)):
        if graph[vertex][i] == 1 and color[i] == c:
            return False
    return True

def m_coloring_util(graph, m, color, vertex):
    if vertex == len(graph):
        return True

    for c in range(1, m + 1):
        if is_safe(graph, color, vertex, c):
            color[vertex] = c

            if m_coloring_util(graph, m, color, vertex + 1):
                return True

            color[vertex] = 0  # Backtrack

    return False

def m_coloring(graph, m):
    color = [0] * len(graph)
    if m_coloring_util(graph, m, color, 0):
        print("Solution:")
        for i in range(len(color)):
            print(f"Vertex {i}: Color {color[i]}")
    else:
        print("No solution exists")


num_vertices = int(input("Enter the number of vertices: "))
graph = []
print("Enter the adjacency matrix (space-separated values for each row):")
for _ in range(num_vertices):
    row = list(map(int, input().split()))
    graph.append(row)

print("Graph:")
for row in graph:
    print(row)

M = 3
m_coloring(graph, M)`
    },
    {
      type: 'markdown',
      content: '##Water Jug'
    },
    {
      type: 'code',
      content: `from collections import deque

def is_goal(state, target):
    return target in state

def get_next_states(state, A, B):
    x, y = state
    return [
        (A, y),         # Fill Jug A
        (x, B),         # Fill Jug B
        (0, y),         # Empty Jug A
        (x, 0),         # Empty Jug B
        (x - min(x, B - y), y + min(x, B - y)),  # Pour A → B
        (x + min(y, A - x), y - min(y, A - x))   # Pour B → A
    ]

def bfs(A, B, target):
    visited = set()
    queue = deque()
    parent = {}

    start = (0, 0)
    queue.append(start)
    visited.add(start)
    parent[start] = None

    while queue:
        state = queue.popleft()
        if is_goal(state, target):
            # Found the goal, trace the path
            path = []
            while state:
                path.append(state)
                state = parent[state]
            path.reverse()
            return path

        for next_state in get_next_states(state, A, B):
            if next_state not in visited:
                visited.add(next_state)
                queue.append(next_state)
                parent[next_state] = state

    return None

# Example Usage
if __name__ == '__main__':
    A = 4   # Capacity of Jug A
    B = 3   # Capacity of Jug B
    target = 2

    solution = bfs(A, B, target)
    if solution:
        print("Steps to reach the target:")
        for step in solution:
            print(f"Jug A: {step[0]}L, Jug B: {step[1]}L")
    else:
        print("No solution found.")`
    },
    {
      type: 'markdown',
      content: '##CSP'
    },
    {
      type: 'code',
      content: `pip install python-constraint
from IPython import get_ipython
from IPython.display import display
import constraint

x_min = int(input("Enter minimum value for x : "))
x_max = int(input("Enter maximum value for x : "))
y_min = int(input("Enter minimum value for y : "))
y_max = int(input("Enter maximum value for y : "))

problem = constraint.Problem()
problem.addVariable('x', range(x_min, x_max + 1))
problem.addVariable('y', range(y_min, y_max + 1))

def our_constraint(x,y):
    if x+y >= 20:
        return True

problem.addConstraint(our_constraint, ['x','y'])
solutions = problem.getSolutions()
length = len(solutions)
print("(x,y) =\\n", end = "")
for index, solution in enumerate(solutions):
    print("({},{})".format(solution['x'], solution['y']), end="")
    if index == length - 1:
        break
    print(",")
print("}")`
    },
    {
      type: 'markdown',
      content: '##Crypt_Arithematic'
    },
    {
      type: 'code',
      content: `import itertools

def get_value(word, substitution):
    s = 0
    factor = 1
    for letter in reversed(word):
        s += factor * substitution[letter]
        factor *= 10  # Fix: Multiply factor by 10
    return s

def solve2(equation):
    left, right = equation.lower().replace(' ', '').split('=') # Fix: Remove spaces
    left = left.split('+')
    letters = set(right)
    for word in left:
        for letter in word:
            letters.add(letter)
    letters = list(letters)
    digits = range(10)
    for perm in itertools.permutations(digits, len(letters)):
        sol = dict(zip(letters, perm))
        if sum(get_value(word, sol) for word in left) == get_value(right, sol):
            print('+'.join(str(get_value(word, sol)) for word in left) + " = {} (mapping: {})".format(get_value(right, sol), sol))

# Get user input
equation = input("Enter the cryptarithmetic equation (e.g., SEND+MORE=MONEY): ")
solve2(equation)`
    },
    {
      type: 'markdown',
      content: '##Alpha-Beta'
    },
    {
      type: 'code',
      content: `import math
nodes_visited = []
MAX, MIN = 1000, -1000

def minimax(cur_depth, node_index, max_turn, scores, target_depth, b_factor, alpha, beta):
    if cur_depth == target_depth:
        return scores[node_index]
    if max_turn:
        largest = None
        for i in range(b_factor):
            index = node_index * b_factor + i
            if index >= len(scores):
                continue
            cur = minimax(cur_depth + 1, index, False, scores, target_depth, b_factor, alpha, beta)
            if largest is None or cur > largest:
                largest = cur
            alpha = max(alpha, largest)
            nodes_visited.append(cur)
            if beta <= alpha:
                break
        return largest
    else:
        smallest = None
        for i in range(b_factor):
            index = node_index * b_factor + i
            if index >= len(scores):
                continue
            cur = minimax(cur_depth + 1, index, True, scores, target_depth, b_factor, alpha, beta)
            if smallest is None or cur < smallest:
                smallest = cur
            beta = min(beta, smallest)
            nodes_visited.append(cur)
            if beta <= alpha:
                break
        return smallest

scores = [int(s) for s in input("Enter the scores: ").split()]
b_factor = int(input("Enter the branching factor: "))
player = int(input("Maximizer or minimizer? (Enter 1 for maximizer and 0 for minimizer): "))
tree_depth = math.ceil(math.log(len(scores), b_factor))
print("The optimal value is:", end="")
print(minimax(0, 0, player, scores, tree_depth, b_factor, MIN, MAX))

diff = []
for i in scores:
    if i not in nodes_visited:
        diff.append(i)
if not diff:
    print("No nodes were pruned")
else:
    print("Pruned nodes are:")
    for i in diff:
        print(i, sep='')`
    },
    {
      type: 'markdown',
      content: '##MiniMax'
    },
    {
      type: 'code',
      content: `import math

def minimax(cur_depth, node_index, max_turn, scores, target_depth, b_factor):
    if cur_depth == target_depth:
        return scores[node_index]
    if (max_turn):
        largest = None
        for i in range(b_factor):
            index = node_index * b_factor + i
            if index >= len(scores):
                continue
            cur = minimax(cur_depth + 1, index, False, scores, target_depth, b_factor)
            if largest is None or cur > largest:
                largest = cur
        return largest
    else:
        smallest = None
        for i in range(b_factor):
            index = node_index * b_factor + i
            if index >= len(scores):
                continue
            cur = minimax(cur_depth + 1, index, True, scores, target_depth, b_factor)
            if smallest is None or cur < smallest:
                smallest = cur
        return smallest

scores = [int(s) for s in input("Enter the scores: ").split()]
b_factor = int(input("enter the branching factor: "))
player = int(input("maximizer or minimizer? (Enter 1 for maximizer and 0 for minimizer): "))
print(player)
tree_depth = math.ceil(math.log(len(scores), b_factor))
print("the optimal value is:", end="")
print(minimax(0, 0, player, scores, tree_depth, b_factor))`
    },
    {
      type: 'markdown',
      content: '##Sparse Matrix'
    },
    {
      type: 'code',
      content: `def analyze_matrix(matrix):
    if not matrix:
        return 0, 0

    n = len(matrix)
    visited = [[False] * n for _ in range(n)]
    max_zeros = 0
    island_count = 0

    def dfs(x, y, is_zero_patch):
        if x < 0 or x >= n or y < 0 or y >= n or visited[x][y]:
            return 0
        if (is_zero_patch and matrix[x][y] == 1) or (not is_zero_patch and matrix[x][y] == 0):
            return 0

        visited[x][y] = True
        count = 1

        count += dfs(x + 1, y, is_zero_patch)
        count += dfs(x - 1, y, is_zero_patch)
        count += dfs(x, y + 1, is_zero_patch)
        count += dfs(x, y - 1, is_zero_patch)
        return count

    for i in range(n):
        for j in range(n):
            if matrix[i][j] == 0 and not visited[i][j]:
                max_zeros = max(max_zeros, dfs(i, j, True))
            elif matrix[i][j] == 1 and not visited[i][j]:
                island_count += 1
                dfs(i, j, False)

    return max_zeros, island_count


matrix = [
    [1, 0, 0, 1, 1],
    [0, 0, 1, 0, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1]
]


largest_patch, number_of_islands = analyze_matrix(matrix)
print("The largest patch of zeros has size:", largest_patch)
print("The number of islands is:", number_of_islands)`
    },
    {
      type: 'markdown',
      content: '##Rotten-Oranges'
    },
    {
      type: 'code',
      content: `from collections import deque

def orangesRotting(grid):
    if not grid:
        return -1

    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh_count += 1

    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    minutes = 0

    while queue and fresh_count > 0:
        for _ in range(len(queue)):
            x, y = queue.popleft()
            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] == 1:
                    grid[nx][ny] = 2
                    fresh_count -= 1
                    queue.append((nx, ny))
        minutes += 1

    return minutes if fresh_count == 0 else -1

# Get user input for the grid
rows = int(input("Enter the number of rows: "))
cols = int(input("Enter the number of columns: "))

grid = []
print("Enter the grid elements row-wise (0 for empty, 1 for fresh, 2 for rotten):")
for _ in range(rows):
    row = list(map(int, input().split()))
    grid.append(row)

result = orangesRotting(grid)
print("Minimum time to rot all oranges:", result)`
    },
    {
      type: 'markdown',
      content: '##Water Connection'
    },
    {
      type: 'code',
      content: `def find_min_weight_paths(num_nodes, connections):

    parents = [0] * (num_nodes + 1)
    weights = [0] * (num_nodes + 1)
    children = [0] * (num_nodes + 1)

    for start, end, weight in connections:
        children[start] = end
        weights[start] = weight
        parents[end] = start

    min_weight_paths = []
    for node in range(1, num_nodes + 1):
        if parents[node] == 0 and children[node]:  # Check if it's a root node with children.
            min_weight = float('inf')
            current_node = node

            while children[current_node] != 0:
                min_weight = min(min_weight, weights[current_node])
                current_node = children[current_node]

            min_weight_paths.append((node, current_node, min_weight))

    return min_weight_paths


if __name__ == "__main__":
    num_nodes = int(input("Enter the number of nodes: "))
    num_connections = int(input("Enter the number of connections: "))

    connections = []
    print("Enter the connections (start_node end_node weight) one by one:")
    for _ in range(num_connections):
        start, end, weight = map(int, input().split())
        connections.append((start, end, weight))

    paths = find_min_weight_paths(num_nodes, connections)
    print("Number of independent paths:", len(paths))
    for start, end, min_weight in paths:
        print(f"Start Node: {start}, End Node: {end}, Minimum Weight: {min_weight}")`
    },
    {
      type: 'markdown',
      content: '##Graph Connection'
    },
    {
      type: 'code',
      content: `def dfs(graph, node, visited):
    visited.add(node)
    for neighbor in graph.get(node, []):
        if neighbor not in visited:
            dfs(graph, neighbor, visited)

def is_connected(graph):
    nodes = list(graph.keys())
    if not nodes:
        return True
    visited = set()
    dfs(graph, nodes[0], visited)
    return len(visited) == len(nodes)

def get_graph_from_user():
    graph = {}
    n = int(input("Enter the number of Nodes: "))

    for _ in range(n):
        node = input("Enter the node name: ")
        neighbors = input(f"Enter the neighbors of {node} (comma-separated): ").split(",")
        neighbors = [neighbor.strip() for neighbor in neighbors]
        graph[node] = neighbors

    print(graph)
    if is_connected(graph):
        print("The graph is connected.")
    else:
        print("The graph is disconnected.")


get_graph_from_user()`
    },
    {
      type: 'markdown',
      content: '##Crossover (genetic)'
    },
    {
      type: 'code',
      content: `def crossover(s1, s2, start, end):
    s1 = str(s1)
    s2 = str(s2)
    s1_list = list(s1)
    s2_list = list(s2)

    s1_list[start:end], s2_list[start:end] = s2_list[start:end], s1_list[start:end]

    child_s1 = ''.join(s1_list)
    child_s2 = ''.join(s2_list)

    return child_s1, child_s2
s1 = int(input("Enter the first parent: "))
s2 = int(input("Enter the second parent: "))
start = int(input("Enter the start index: "))
end = int(input("Enter the end index: "))
child_s1, child_s2 = crossover(s1, s2, start, end)
print(f"Original s1: {s1}, Original s2: {s2}")
print(f"Child s1: {child_s1}, Child s2: {child_s2}")`
    },
    {
      type: 'markdown',
      content: '##Tic-Tac-Toe'
    },
    {
      type: 'code',
      content: `def tic_tac_toe(mat):
    x,o = 0,0
    coord = []
    for i in range(3):
        for j in range(3):
            if mat[i][j]==1:
                x+=1
            elif mat[i][j]==2:
                o+=1
            else:
                coord.append([i,j])
    return "Player X" if o>x else "Player O",coord
matrix = [[1, 0, 2],[0, 2, 0],[1, 0, 1]]
move,coord = tic_tac_toe(matrix)
print("Next Move Belongs to",move)
print("Available Moves :",coord)`
    }
  ];

  return (
    <div className="clipboard-page">
      <div className="clipboard-container">
        <h1>Code Clipboard</h1>
        <div className="notebook">
          {notebookData.map((cell, index) => (
            <div key={index} className={`cell ${cell.type}-cell`}>
              {cell.type === 'markdown' ? (
                <div className="markdown-content">
                  {cell.content}
                </div>
              ) : (
                <div className="code-cell">
                  <div className="code-header">
                    <div className="code-title" onClick={() => toggleCodeExpansion(index)}>
                      {expandedCodes[index] ? <FaChevronDown /> : <FaChevronRight />}
                      <span>Python</span>
                    </div>
                    <button 
                      className={`copy-button ${copiedIndex === index ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(cell.content, index)}
                    >
                      {copiedIndex === index ? (
                        <>
                          <FaCheck /> Copied
                        </>
                      ) : (
                        <>
                          <FaCopy /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  {expandedCodes[index] && (
                    <pre className="code-content">
                      <code>{cell.content}</code>
                    </pre>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClipboardPage; 