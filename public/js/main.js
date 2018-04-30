$(document).ready(function(){
        $('.delete-article').on('click',function(e){
            $target = $(e.target);
            const id =$target.attr('data-id');
            $.ajax({
                type:'DELETE',
                url:'/articles/'+id,
            success: function(res){
                    alert('deleting article');
                    window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }  
         });

        })
});
$(document).ready(function(){
    $('.delete-fromcart').on('click',function(e){
        $target = $(e.target);
        const id =$target.attr('data-id');
        const user_id=$target.attr('user_id');
        $.ajax({
            type:'DELETE',
            url:'/users/cart/'+id,
        success: function(res){
                alert('removing from cart');
                window.location.href='/users/cart/'+user_id;
        },
        error: function(err){
            console.log(err);
        }  
     });

    })
});
$('#example').tooltip(options)