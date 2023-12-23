var userId = null

AFRAME.registerComponent("markerhandler", {
    init: async function () {

      if (userId === null) {
        this.askUserId();
      }
  
      //get the dishes collection from firestore database
      var toys = await this.getToys();
  
      //markerFound event
      this.el.addEventListener("markerFound", () => {
        var markerId = this.el.id;      
        this.handleMarkerFound(toys, markerId);
      });
  
      //markerLost event
      this.el.addEventListener("markerLost", () => {
        this.handleMarkerLost();
      });
  
    },
    askUserId: function() {
      var iconUrl = "";
      swal({
        title: "Welcome to Toy Shop!!",
        icon: iconUrl,
        content: {
          element: "input",
          attributes: {
            placeholder: "Type your uid",
            type: "string",
            min:1
          }
        },
        closeOnClickOutside: false,
      }).then(inputValue => {
        userId: inputValue
      });
      
    },

    
        
       
    handleMarkerFound: function (toys, markerId) {
     
      var toy = toys.filter(toy => toy.id === markerId)[0];

      if (dish.is_out_of_stock === true) {
        swal({
          icon: "warning",
          title: toy.toy_name.toUpperCase(),
          text: "This toy is out of stock today!!!",
          timer: 2500,
          buttons: false
        });
      } else {
                 
      // Changing Model scale to initial scale
  
      var model = document.querySelector(`#model-${toy.id}`);
      model.setAttribute("position", toy.model_geometry.position);
      model.setAttribute("rotation", toy.model_geometry.rotation);
      model.setAttribute("scale", toy.model_geometry.scale);

      //Update UI conent VISIBILITY of AR scene(MODEL , DESCRIPTION & PRICE)
      model.setAttribute("visible",true);

      var descriptionContainer = document.querySelector(`#main-plane-${toy.id}`);
      descriptionContainer.setAttribute("visible", true);

      var pricePlane = document.querySelector(`#price-plane-${toy.id}`);
      pricePlane.setAttribute("visible", true)


       // Changing button div visibility
       var buttonDiv = document.getElementById("button-div");
       buttonDiv.style.display = "flex";
   
       var orderButton = document.getElementById("order-button");
       var orderSummaryButtton = document.getElementById("order-summary-button");
   
       // Handling Click Events
       orderButton.addEventListener("click", function () {
        var uId;
         userId <= 9 ? (uId = `U0${userId}`) : `U${userId}`
         this.handleOrder(uId, toy);
         swal({
           icon: "warning",
           title: "Order Now",
           text: "Work In Progress"
         });
       });
   
       orderSummaryButtton.addEventListener("click", () => {
         swal({
           icon: "warning",
           title: "Order Summary !",
           text: "Work in Progress!"
         });
       });
      }
    },
    handleOrder: function(uId, toy) {
      firebase
      .firestore()
      .collection("toys")
      .doc(uId)
      .get()
      .then(doc => {
        var details = doc.data();
        if(details[current_orders][id]) {
          details[current_orders][id][quantity] += 1;
          var currentQuantity = details[current_orders][id][quantity]
          details[current_orders][id][subtotal] =
            currentQuantity * price
        } else {
          details[current_orders][id] = {
            item: toy_name,
            price: price,
            quantity: 1,
            subtotal: price * 1
          }
        }
        details.total_bill += price;
        firebase
        .firestore()
        .collection("users")
        .doc(doc.id)
        .update(details)
      })
    },
       //get the toys collection from firestore database
    getToys: async function () {
        return await firebase
          .firestore()
          .collection("toys")
          .get()
          .then(snap => {
            return snap.docs.map(doc => doc.data());
          });
      },
  
    handleMarkerLost: function () {
      // Changing button div visibility
      var buttonDiv = document.getElementById("button-div");
      buttonDiv.style.display = "none";
    },
 
  });
  