/*
    Let’s say we have a complex object, and we’d like to convert it into a string, 
    to send it over a network, or just to output it for logging purposes.

    Naturally, such a string should include all important properties.

    We could implement the conversion like this:

*/

let user = {
    name: "Pranav",
    age: 34,

    toString() {
        return `{name : ${this.name}, age : ${this.age}}`;
    },
};
console.log(user);
console.log(String(user));
console.log("\n");




/*
    🧠 Explanation for Beginners:

    We're creating a JavaScript object called 'user' that represents a person with two properties:
    - name: a string ("Pranav")
    - age: a number (34)

    Inside the object, we define a special method called toString().
    This is a built-in method in JavaScript that is automatically called when we try to 
    convert the object to a string (e.g., using String(user) or during concatenation).

    By default, if you don't define your own toString(), JavaScript will return "[object Object]".

    But in this example, we customize the toString() method to return a formatted string
    that includes the user's name and age in this format: "{name: Pranav, age: 34}"

    So now, whenever we use String(user) or try to print the object as a string,
    JavaScript will use our custom version of toString(), which makes the output much more readable.

    ✅ This is very useful when:
    - You want to log objects clearly in the console
    - You want to send readable string representations over the network
    - You want control over how your object looks when converted to text
*/




/*
    …But in the process of development, new properties are added, old properties are 
    renamed and removed. Updating such toString every time can become a pain. 
    We could try to loop over properties in it, but what if the object is complex 
    and has nested objects in properties? We’d need to implement their conversion as well.

    Luckily, there’s no need to write the code to handle all this. The task has been solved already.
*/











//-------------------> JSON.stringify

/*
    📌 What is JSON.stringify()?
        JSON.stringify() is a method that converts a JavaScript object or value into a JSON-formatted string.

    Useful for:
        - Saving data in storage (like localStorage)
        - Sending data over a network (e.g., via fetch())
        - Logging objects as readable strings



    🧪 Syntax : JSON.stringify(value, replacer, space)

        - value	   : The value (usually an object or array) to convert
        - replacer : (Optional) A function or array to control what should be included
        - space	   : (Optional) Adds indentation, white space, and line breaks for readability



    🧰 JavaScript provides methods:

        1. JSON.stringify() to convert objects into JSON.
        2. JSON.parse() to convert JSON back into an object.

*/



// 1. Basic Example

user = {
    name: "Alice",
    age: 30,
    isAdmin: true,
};
console.log(user);

let jsonString = JSON.stringify(user);
console.log(jsonString); // Output: {"name":"Alice","age":30,"isAdmin":true}
console.log();



/*
    The method JSON.stringify(user) takes the object and converts it into a string.

    The resulting json string is called a JSON-encoded or serialized or stringified or 
    marshalled object. We are ready to send it over the wire or put into a plain data store.

    Please note that a JSON-encoded object has several important differences from the object literal:

    Strings use double quotes. No single quotes or backticks in JSON. So 'Alice' becomes "Alice".
    All property names and string values are wrapped in double quotes. That’s obligatory. 
    So age:30 becomes "age":30. JSON.stringify can be applied to primitives as well.

*/





// 2. Nested Object Example

user = {
    name: "Bob",
    contact: {
        email: "bob@example.com",
        phone: "1234567890",
    },
};
console.log(user);

console.log(JSON.stringify(user)); // Output: {"name":"Bob","contact":{"email":"bob@example.com","phone":"1234567890"}}
console.log();



/*
    JSON supports following data types:
        Objects { ... }
        Arrays [ ... ]
        Primitives:
            strings,
            numbers,
            boolean values true/false,
            null.

*/

console.log(JSON.stringify(1));
console.log(JSON.stringify("test"));
console.log(JSON.stringify(true));
console.log(JSON.stringify([1, 2, 3]));
console.log(JSON.stringify([1, "hello", { x: 10 }]));
console.log();



/*
    JSON is data-only language-independent specification, so some JavaScript-specific object 
    properties are skipped by JSON.stringify.

    Namely:
    - Function properties (methods).
    - Symbolic keys and values.
    - Properties that store undefined.
*/






// 3. undefined, Functions, and Symbols are skipped (Functions, undefined, and Symbols are not valid in JSON and are removed.)

user = {
    name: "Charlie",
    sayHi: function () {
        console.log("Hii");
    },
    age: undefined,
    id: Symbol("id"),
};
console.log(user);
console.log(JSON.stringify(user)); // Output: {"name":"Charlie"}
console.log();







// 4. The important limitation: there must be no circular references

let room = {
    number: 23,
};

let meetup = {
    title: "Conference",
    participants: ["john", "ann"],
};

meetup.place = room; // meetup references room
room.occupiedBy = meetup; // room references meetup

// JSON.stringify(meetup); // Error: Converting circular structure to JSON

console.log("\n");











//------------------> Excluding and transforming: replacer

/*
    The full syntax of JSON.stringify is: JSON.stringify(value[, replacer, space])

        - value    : A value to encode.
        - replacer : Array of properties to encode or a mapping function - function(key, value).
        - space    : Amount of space to use for formatting

    
    Most of the time, JSON.stringify is used with the first argument only. 
    But if we need to fine-tune the replacement process, like to filter 
    out circular references, we can use the second argument of JSON.stringify.
    
*/
   


// If we pass an array of properties to it, only these properties will be encoded.


room = {
  number: 23
};

meetup = {
  title: "Conference",
  participants: [{name: "John"}, {name: "Alice"}],
  place: room // meetup references room
};

room.occupiedBy = meetup; // room references meetup

console.log( JSON.stringify(meetup, ['title', 'participants']) ); // {"title":"Conference","participants":[{},{}]}
console.log()

/*
    Here we are probably too strict. The property list is applied to the whole object structure. 
    So the objects in participants are empty, because name is not in the list.

    Let’s include in the list every property except room.occupiedBy that would 
    cause the circular reference:
*/

room = {
    number: 23,
};

meetup = {
    title: "Conference",
    participants: [{ name: "John" }, { name: "Alice" }],
    place: room, // meetup references room
};

room.occupiedBy = meetup; // room references meetup

console.log( JSON.stringify(meetup, ['title', 'participants', 'place', 'name', 'number']) );
/*
{
  "title":"Conference",
  "participants":[{"name":"John"},{"name":"Alice"}],
  "place":{"number":23}
}
*/
console.log()




/*
    Now everything except occupiedBy is serialized. But the list of properties is quite long.

    Fortunately, we can use a function instead of an array as the replacer.

    The function will be called for every (key, value) pair and should return the “replaced” value, 
    which will be used instead of the original one. Or undefined if the value is to be skipped.

    In our case, we can return value “as is” for everything except occupiedBy. 
    To ignore occupiedBy, the code below returns undefined:
*/

room = {
  number: 23
};

meetup = {
  title: "Conference",
  participants: [{name: "John"}, {name: "Alice"}],
  place: room // meetup references room
};

room.occupiedBy = meetup; // room references meetup

console.log( JSON.stringify(meetup, function replacer(key, value) {
  console.log(`${key}: ${value}`);
  return (key == 'occupiedBy') ? undefined : value;
}));

/* key:value pairs that come to replacer:
    :             [object Object]
    title:        Conference
    participants: [object Object],[object Object]
    0:            [object Object]
    name:         John
    1:            [object Object]
    name:         Alice
    place:        [object Object]
    number:       23
    occupiedBy: [object Object]
*/







/*
    Please note that replacer function gets every key/value pair including nested objects 
    and array items. It is applied recursively. The value of this inside replacer is the 
    object that contains the current property.

    The first call is special. It is made using a special “wrapper object”: {"": meetup}. 
    In other words, the first (key, value) pair has an empty key, and the value is the target 
    object as a whole. That’s why the first line is ":[object Object]" in the example above.

    The idea is to provide as much power for replacer as possible: it has a chance to analyze 
    and replace/skip even the whole object if necessary.
*/












