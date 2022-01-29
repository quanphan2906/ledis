# Ledis

A simple, light-weight version of Redis. Built with Vue 3.

# Design

Ledis runs entirely on a single web page, and requires no back-end server or database. This means the state of the app does not persist between page reloads.

Design of Ledis is broken down into 2 parts:

1. User interface (UI)
2. Mock server

## UI

The UI was built with Vue 3. The component structure is simple:

-   `App`
    -   `CommandLine`
    -   `Line`

`CommandLine` is the component that wraps around the (black) console area. Each `Line` contains a previous command or the result of a previous command.

## Mock server

In the `mock-server` folder, I create a `database` variable to act as the database of the app (this "database" is not preserved between page reloads of course). Along with this constant is multiple functions that modify the mock database.

There are two reasons why I save the state of the app into a JS variable instead of a reactive object in the `App` component:

1. I want the mock server to resemble a real server as much as possible, and an app with a back-end server will not save its database live in the front-end.
2. I have already had a reactive object (`result`) in the `App` component to determine what should be rendered in the `Line` component(s) and when `App` should re-render, so declaring another reactive object to serve as a database is redundant.

## Another perspective on the design

MVC architecture

# Syntax assumption

If you do not pass enough, it will throw Error. If you pass more arguments than required, only the first arguments are used. (**TODO**: Polish this).

# What is added?

1. The keys will actually expired after a timeout is set on a key.
