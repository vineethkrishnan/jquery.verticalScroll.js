# jquery.verticalScroll.js

jquery.verticalScroll.js is a javascript library to provice single page vertical scrolling for your SPA.

## INSTALLATION

- Download repo to your project

```
git clone https://github.com/vineethkrishnan/jquery.verticalScroll.js
```

- Add style and js to your page

## HTML

```html
<div id="page">
	<div>
		My First Section 
	<div>
	<div>
		My Second Section 
	<div>
	<div>
		My Third Section 
	<div>
	<div>
		My Fourth Section 
	<div>
<div>
```

## JavaScript

```js
$("#page")..verticalScroll();
```


### Available Options
```js
$("#page")..verticalScroll({
	selector: 'div',
	paginate: true
});
```

- `selector` : element inside the main div element (Default : div)
- `paginate` : Detect if we want to show the navigation buttons (Default : true).
