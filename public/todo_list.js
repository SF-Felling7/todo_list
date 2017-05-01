console.log("sourced");

$( document ).ready( function() {
  console.log("JQ");
  getTask();

  $('#taskButton').on( 'click', addTask );
  $('.deleteButton').on( 'click', deleteButton );
  $('.completeButton').on( 'click', completeButton);
});

function getTask() {
  console.log( 'in: get list' );
  //AJAX CALL TO SERVER TO GET todo_list
  $.ajax({
    url: '/getTask',
    type:'GET',
    success: function( data ) {
      console.log('get lists');
      for (var i = 0; i < data.length; i++) {
          var appendString = ' ';
            appendString+= '<div class="newRow">' + data[i].taskname + data[i].description;
            appendString+= '<button class="completeButton">  complete</button>';
            appendString+= '<button class="deleteButton">   delete</button>' +'</div>';
            $('#containerDiv').append(appendString);
      }
    }//END SUCCESS
  });//END AJAX
}//END FUNCTION

function addTask() {
  console.log( 'adding tasks' );

  var newTask = $( '#inputTask' ).val();
  console.log( newTask );
  var newDescription = $( '#inputDes' ).val();
  var newTaskToSend = {
    taskname: newTask,
    description: newDescription

  };
  console.log('sending ', newTaskToSend);
  //AJAX CALL TO SERVER TO POST todo_list
  $.ajax({
    url:'/addTask',
    type:'POST',
    data:newTaskToSend,
    success: function( data ) {
      console.log( 'enable adding task', data );
    }//END SUCCESS
  });//END AJAX
}//END FUNCTION

function completeButton() {
  $( '.completeButton' ).css( 'background-color', 'green');
}

function deleteButton() {
  console.log( 'delete task' );
  var id = $('#textLine').find( ':selected' ).data( 'taskid' );

  var deleteTaskToSend = {
    id: id
  };

  $.ajax ({
    url:'/deleteButton',
    type: 'DELETE',
    data: deleteTaskToSend,
    success: function( data ){
      console.log('back from server with: ', data );
      addTask();
    } //end success
  });
}
