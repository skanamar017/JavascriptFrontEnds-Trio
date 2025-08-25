# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains three identical Task Manager applications implemented in different JavaScript technologies, progressing from fundamentals to modern frameworks:

- `src/vanillaJS/` - Pure JavaScript + Fetch API implementation
- `src/vuejs/` - Vue.js implementation with reactive data binding
- `src/react/` - React implementation with hooks and modern patterns

Each implementation demonstrates the same Task Manager functionality while showcasing framework-specific patterns and best practices.

## Task Manager Application Requirements

All three implementations must include:

### Core Features
- **CRUD Operations**: Create, Read, Update, Delete tasks
- **Task Properties**: Title, description, priority, completion status
- **Task Filtering**: View all tasks, pending tasks, or completed tasks
- **Task Statistics**: Display count of total/pending/completed tasks
- **Form Validation**: Proper input validation and error handling
- **Responsive Design**: Mobile-friendly user interface

### Technical Requirements
- **API Integration**: Consume REST API endpoints for task management
- **Error Handling**: Network errors, API errors, user-friendly messages
- **Loading States**: Show loading indicators during API operations
- **Optimistic Updates**: Update UI immediately, rollback on failure
- **Performance**: Implement debouncing for search, efficient rendering

## REST API Foundation

All implementations should demonstrate understanding of:
- HTTP methods (GET, POST, PUT, DELETE)
- Status codes (2xx success, 4xx client errors, 5xx server errors)
- Resource-based URLs (e.g., `/tasks/{id}`)
- Proper request/response handling

## Framework-Specific Implementation Patterns

### Vanilla JavaScript (`src/vanillaJS/`)
- **Core Technologies**: HTML5, CSS3, ES6+ JavaScript, Fetch API
- **Architecture**: Modular JavaScript with separated concerns
- **State Management**: Class-based TaskManager with local state
- **DOM Manipulation**: Modern DOM APIs, event delegation
- **Key Concepts**: Promises/async-await, error boundaries, performance optimization

### Vue.js (`src/vuejs/`)
- **Core Technologies**: Vue.js 3 with Options API or Composition API
- **Architecture**: Component-based with props/emit communication
- **State Management**: Reactive data properties, computed properties
- **Template Features**: v-model, v-for, v-if, event handlers (@click)
- **Key Concepts**: Reactivity, lifecycle hooks (mounted), two-way binding

### React (`src/react/`)
- **Core Technologies**: Modern React with functional components
- **Architecture**: Component hierarchy with unidirectional data flow
- **State Management**: useState, useEffect, useMemo, custom hooks
- **Performance**: React.memo, useCallback, proper key props
- **Key Concepts**: Hooks, controlled components, component lifecycle

## Development Workflow

When implementing or modifying functionality:
1. Start with Vanilla JS to understand core concepts
2. Implement Vue.js version using reactive patterns
3. Build React version with modern hook patterns
4. Ensure feature parity across all implementations
5. Test all CRUD operations and edge cases
6. Verify responsive design on different screen sizes

## File Structure Expectations

### Vanilla JS Structure
```
src/vanillaJS/
├── index.html
├── styles.css
├── app.js (main application logic)
├── api.js (API interaction module)
└── utils.js (utility functions)
```

### Vue.js Structure
```
src/vuejs/
├── index.html
├── app.vue (or separate components)
├── package.json
└── styles.css
```

### React Structure
```
src/react/
├── public/index.html
├── src/
│   ├── App.js
│   ├── components/
│   ├── hooks/ (custom hooks)
│   └── utils/
├── package.json
└── package-lock.json
```

## Learning Progression

This project demonstrates the evolution from:
1. **Vanilla JS**: Direct DOM manipulation and imperative programming
2. **Vue.js**: Declarative templates with reactive data binding
3. **React**: Component-based architecture with functional programming patterns

Each implementation should showcase the strengths and patterns specific to its technology stack while maintaining identical user functionality.