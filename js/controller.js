(function (window, document, undefined) {
	"use strict";

    // var mockup = {
    //     categories : [
    //         {
    //             id : 1,
    //             name : "Nabiał",
    //             description : "Produkty mleczne",
    //             items_all: 3,
    //             items_done: 0
    //         },
    //         {
    //             id : 2,
    //             name : "Warzywa",
    //             description : "Po prostu warzywa",
    //             items_all: 2,
    //             items_done: 0
    //         }
    //     ],
    //     products : [
    //         {
    //             id : 1,
    //             category_id : 1,
    //             name : "jajka",
    //             description : "po prostu jajka",
    //             buyed : false,
    //             priority : 2,
    //             quantity : "3 sztuki",
    //             prize : "12zł"
    //         },
    //         {
    //             id : 2,
    //             category_id : 1,
    //             name : "jajka i tyle",
    //             description : "po prostu jajka",
    //             buyed : false,
    //             priority : 2,
    //             quantity : "4 sztuki",
    //             prize : "12zł"
    //         },
    //         {
    //             id : 3,
    //             category_id : 1,
    //             name : "jajka i jeszcze raz jajka",
    //             description : "po prostu jajka",
    //             buyed : false,
    //             priority : 1,
    //             quantity : "5 sztuk",
    //             prize : "12zł"
    //         },
    //         {
    //             id : 4,
    //             category_id : 2,
    //             name : "ogórek",
    //             description : "po prostu ogórek",
    //             buyed : false,
    //             priority : 2,
    //             quantity : "4 sztuki",
    //             prize : "12zł"
    //         },
    //         {
    //             id : 5,
    //             category_id : 2,
    //             name : "pomidor",
    //             buyed : false,
    //             priority : 1,
    //             quantity : "5 sztuk",
    //             prize : "12zł"
    //         },
    //         {
    //             id : 6,
    //             category_id : null,
    //             name : "pomidor bez kategorii",
    //             buyed : false,
    //             priority : 1,
    //             quantity : "5 sztuk",
    //             prize : "12zł"
    //         },
    //         {
    //             id : 7,
    //             category_id : null,
    //             name : "trabant",
    //             buyed : false,
    //             priority : 1,
    //             quantity : "5 sztuk",
    //             prize : "12zł"
    //         },
    //         {
    //             id : 8,
    //             category_id : null,
    //             name : "czekoladka z wisienką mmm",
    //             buyed : false,
    //             priority : 1,
    //             quantity : "5 sztuk",
    //             prize : "12zł"
    //         }
    //     ],
    //     uncategorized : {
    //         name : "Uncategorized",
    //         items_all: 3,
    //         items_done: 0
    //     },
    //     options : {
    //         landscape : true
    //     }
    // };

    // localStorage.setItem("shopen", JSON.stringify(mockup));

    var shopen = shopen || {};

    if (localStorage.shopen && typeof localStorage.shopen !== 'undefined') {
        shopen.base = JSON.parse(localStorage.shopen);
    } else {
        shopen.base = {
            categories : [],
            products : [],
            uncategorized : {
                name : "Uncategorized",
                items_all: 0,
                items_done: 0
            },
            options : {
                landscape : true
            }
        };
    }

    shopen.sort = function (tab, id, desc) {
        if (desc) {
            tab.sort(function(a,b) { return parseFloat(b[id]) - parseFloat(a[id]) } );
        } else {
            tab.sort(function(a,b) { return parseFloat(a[id]) - parseFloat(b[id]) } );
        }
    };

    shopen.findCategory = function (id) {
        var categories = shopen.base.categories,
            item;

        for (var i = 0, _length = categories.length; i < _length; i++) {
            if (categories[i].id == id) {
                item = {
                    category: categories[i],
                    count: i
                }
                return item;
            }
        }
        return null;
    };

    shopen.modifyCategory = function (id, elems) {
        var item, ob;

        item = shopen.findCategory(id);

        for (ob in item.category) {
            if (item.category.hasOwnProperty(ob)) {
                if (typeof elems[ob] !== 'undefined') {
                    item.category[ob] = elems[ob];
                }
            }
        }

        shopen.refresh();
    };

    shopen.modifyUncategorized = function (elems) {
        var item, ob;

        item = shopen.base.uncategorized;

        for (ob in item) {
            if (item.hasOwnProperty(ob)) {
                if (typeof elems[ob] !== 'undefined') {
                    item[ob] = elems[ob];
                }
            }
        }

        shopen.refresh();
    };

    shopen.modifyOptions = function (elems) {
        var item, ob;

        item = shopen.base.options;

        for (ob in item) {
            if (item.hasOwnProperty(ob)) {
                if (typeof elems[ob] !== 'undefined') {
                    item[ob] = elems[ob];
                }
            }
        }

        shopen.refresh();
    };

    shopen.renameUncategorized = function (name) {
        shopen.base.uncategorized.name = name;
        shopen.refresh();
    };

    shopen.deleteCategory = function (id) {
        var categories = shopen.base.categories;

        for (var i = 0, _length = categories.length; i < _length; i++) {
            if (categories[i].id == id) {
                categories.splice(i, 1);
                break;
            }
        }

        shopen.refresh();
    };

    shopen.clearCategories = function () {
        shopen.base.categories.length = 0;
        shopen.uncategorizedAllProducts();
    };

    shopen.addCategory = function (elems) {
        var categories = shopen.base.categories;

        elems.id = shopen.findFreeId(categories);
        categories[categories.length] = elems;

        shopen.refresh();
    };

    shopen.isEmptyCategoryList = function () {
        var categories = shopen.base.categories;

        if (categories.length == 0) {
            return true;
        }
        return false;
    };

    shopen.clearAllProducts = function () {
        var categories = shopen.base.categories;
        for (var i = 0, _length = categories.length; i < _length; i++) {
            categories[i].items_all = 0;
            categories[i].items_done = 0;
        }

        shopen.base.uncategorized.items_all = 0;
        shopen.base.uncategorized.items_done = 0;

        shopen.base.products.length = 0;
        shopen.refresh();
    };

    shopen.isEmptyProductList = function (dones) {
        var categories = shopen.base.categories,
            item = shopen.base.uncategorized,
            checkNormal = true,
            checkUncat = true;

        if (!dones) {
            for (var i = 0, _length = categories.length; i < _length; i++) {
                if (categories[i].items_all > 0) {
                    checkNormal = false;
                    break;
                }
            }
            if (item.items_all > 0) {
                checkUncat = false;
            }
        } else {
            for (var i = 0, _length = categories.length; i < _length; i++) {
                if (categories[i].items_done > 0) {
                    checkNormal = false;
                    break;
                }
            }
            if (item.items_done > 0) {
                checkUncat = false;
            }
        }

        if (checkNormal != checkUncat) {
            return false;
        } else if ((checkNormal == checkUncat) && !checkNormal)  {
            return false;
        } else {
            return true;
        }
    };

    shopen.addProduct = function (elems) {
        var products = shopen.base.products;

        elems.id = shopen.findFreeId(products);
        products[products.length] = elems;

        shopen.refresh();
    };

    shopen.findProduct = function (id) {
        var products = shopen.base.products,
            item;

        for (var i = 0, _length = products.length; i < _length; i++) {
            if (products[i].id == id) {
                item = {
                    product: products[i],
                    count: i
                }
                return item;
            }
        }
        return null;
    };

    shopen.modifyProduct = function (id, elems) {
        var item, ob;

        item = shopen.findProduct(id);

        for (ob in item.product) {
            if (item.product.hasOwnProperty(ob)) {
                if (typeof elems[ob] !== 'undefined') {
                    item.product[ob] = elems[ob];
                }
            }
        }

        shopen.refresh();
    };

    shopen.deleteProduct = function (id) {
        var products = shopen.base.products;

        for (var i = 0, _length = products.length; i < _length; i++) {
            if (products[i].id == id) {
                products.splice(i, 1);
                break;
            }
        }
        shopen.refresh();
    };

    shopen.uncategorizedAllProducts = function () {
        var products = shopen.base.products,
            category = shopen.base.uncategorized;

        for (var i = 0, _length = products.length; i < _length; i++) {
            if (products[i].category_id != null) {
                if (products[i].buyed) {
                    shopen.modifyUncategorized({items_all: category.items_all+1, items_done: category.items_done+1});
                } else {
                    shopen.modifyUncategorized({items_all: category.items_all+1});
                }
                products[i].category_id = null;
            }
        }

        shopen.refresh();
    };

    shopen.uncategorizedProducts = function (id) {
        var products = shopen.base.products,
            category = shopen.base.uncategorized;

        for (var i = 0, _length = products.length; i < _length; i++) {
            if (products[i].category_id == id) {
                if (products[i].buyed) {
                    shopen.modifyUncategorized({items_all: category.items_all+1, items_done: category.items_done+1});
                } else {
                    shopen.modifyUncategorized({items_all: category.items_all+1});
                }
                products[i].category_id = null;
            }
        }

        shopen.refresh();
    };

    shopen.findFreeId = function (tab) {
        shopen.sort(tab, "id");
        for (var i = 0, _length = tab.length; i < _length; i++) {
            if (tab[i].id != i+1){
                return (i+1);
            }
        }

        return (tab.length+1);
    };

    shopen.clearAllData = function () {
        shopen.renameUncategorized("Uncategorized");

        shopen.modifyOptions({
            landscape : true
        });

        shopen.base.categories.length = 0;
        shopen.base.products.length = 0;
        shopen.base.uncategorized.items_all = 0;
        shopen.base.uncategorized.items_done = 0;

        shopen.refresh();
    };

    shopen.refresh = function () {
        try {
            localStorage.setItem("shopen", JSON.stringify(shopen.base));
        } catch (e) {
            bb.pushScreen('views/mainView.html', 'mainView', {error: true});
        }
    };

    shopen.orientation = function (bools) {
        if (!bools) {
            blackberry.app.rotate('portrait-primary');

            setTimeout(function () {
                blackberry.app.lockOrientation("landscape-primary");
                blackberry.app.lockOrientation("landscape-secondary");
            }, 1000);
        } else {
            blackberry.app.unlockOrientation();
        }
    };

    shopen.createCategoriesList = function () {
        var elements = "",
            cat = shopen.base.categories;

        shopen.sort(shopen.base.categories, "category_id");

        if (!shopen.isEmptyCategoryList()) {
            elements += "<div class='products-category'>";
            elements += "<h2><span class='left'>Categories: </span>";
            elements += "<span class='products-count left'>" + cat.length + "</span>";
            elements += "</h2>";
            elements += "<div class='products-list'>";

            for (var i = 0, _length = cat.length; i < _length; i++) {
                var elem = "<div class='item-row' data-id='" + cat[i].id + "'>";
                elem += "<span class='item-ok icon-file-edit'></span>";

                elem += "<span class='item-name'>" + cat[i].name + "</span>";
                elem += "<span class='item-delete icon-remove-circle'></span>";
                elem += "<div class='item-row-desc'>";
                elem += "<span class='item-all-items'>All items: <span class='gray'>" + cat[i].items_all + "</span></span>";
                elem += "<span class='item-purchased'>Purchased: <span class='gray'>" + cat[i].items_done + "</span></span>";
               
                if (cat[i].description != "" && cat[i].description) {
                    elem += "<div class='cat-description'>";
                    elem += "<span class='item-description'>Description: <span class='gray'>" + cat[i].description + "</span></span>";
                    elem += "</div>";
                }

                elem += "</div>";

                elem += "</div>";

                elements += elem;
            }

            elements += "</div></div>";
        } else {
            elements += "<div class='empty-list'>";
            elements += "<h2>Your category list is empty</h2>";
            elements += "<div id='addCategoryButton'>";
            elements += "<span class='icon-inbox-alt'></span>";
            elements += "<span class='add_product_category'>Add category</span>";
            elements += "</div>";
            elements += "</div>";
        }
        return elements;
    };

    shopen.createProductList = function (dones) {
        var elements = "",
            cat = shopen.base.categories,
            prod = shopen.base.products,
            uncat = shopen.base.uncategorized,
            countProduct = 0,
            check;

        shopen.sort(shopen.base.products, "id");
        shopen.sort(shopen.base.categories, "category_id");

        if (dones) {
            check = "items_done";
        } else {
            check = "items_all";
        }

        for (var i = 0, _length = cat.length; i < _length; i++) {
            if (cat[i][check] > 0) {
                elements += "<div data-id='" + cat[i].id + "' class='products-category'>";
                elements += "<h2><span class='icon-inbox left'></span>";
                elements += "<span class='products-count left'>" + cat[i][check] + "</span>";
                elements += "<span class='right'>" + cat[i].name + "</span></h2>";
                elements += "<div class='products-list'>";

                for (var k = 0, _length2 = prod.length; k < _length2; k++) {
                    if (!dones) {
                        if (prod[k].category_id == cat[i].id) {
                            var elem = "<div class='item-row' data-id='" + prod[k].id + "'>";
                                if (prod[k].buyed) {
                                    elem += "<span class='item-ok icon-ok yellow'></span>";
                                } else {
                                    elem += "<span class='item-ok icon-ok'></span>";
                                }
                            
                            if (prod[k].priority == 1) {
                                if (prod[k].buyed) {
                                    elem += "<span class='item-name strike'><span class=' grays icon-asterisk'></span>" + prod[k].name + "</span>";
                                } else {
                                    elem += "<span class='item-name'><span class='icon-asterisk'></span>" + prod[k].name + "</span>";
                                }
                            } else {
                                if (prod[k].buyed) {
                                    elem += "<span class='strike item-name'>" + prod[k].name + "</span>";
                                } else {
                                    elem += "<span class='item-name'>" + prod[k].name + "</span>";
                                }
                            }
                            
                            elem += "<span class='item-delete icon-remove-circle'></span>";
                            elem += "<div class='item-row-desc'>";
                            elem += "<span class='item-priority'>Priority: " + ((prod[k].priority == 1) ? "<span class='red'>high</span>" : "<span class='gray'>normal</span>") + "</span>";
                            if (prod[k].unit != "" && prod[k].unit) {
                                elem += "<span class='item-qty'>Qty: <span class='gray'>" + prod[k].quantity + " " + prod[k].unit + "</span></span>";
                            } else {
                                elem += "<span class='item-qty'>Qty: <span class='gray'>" + prod[k].quantity + "</span></span>";
                            }
                            elem += "<span class='item-prize'>Prize: <span class='gray'>" + prod[k].prize + "</span></span>";
                            
                            if (prod[k].description != "" && prod[k].description) {
                                elem += "<div class='prod-description'>";
                                elem += "<span class='item-description'>Note: <span class='gray'>" + prod[k].description + "</span></span>";
                                elem += "</div>";
                            }

                            elem += "<div class='btn-edit'>";
                            elem += '<div class="alertify-button alertify-button-ok" id="addProduct"><span class="icon-file-edit"></span> Edit</div>';
                            elem += "</div>";

                            elem += "</div>";

                            elem += "</div>";

                            elements += elem;

                            countProduct++;
                        }

                        if (countProduct >= cat[i].items_all) {
                            break; 
                        }
                    } else {
                        if (prod[k].category_id == cat[i].id && prod[k].buyed) {
                            var elem = "<div class='item-row' data-id='" + prod[k].id + "'>";
                                elem += "<span class='item-ok icon-ok yellow'></span>";
                            
                            if (prod[k].priority == 1) {
                                elem += "<span class='item-name strike'><span class='grays icon-asterisk'></span>" + prod[k].name + "</span>";
                            } else {
                                elem += "<span class='item-name strike'>" + prod[k].name + "</span>";
                            }
                            
                            elem += "<span class='item-delete icon-remove-circle'></span>";
                            elem += "<div class='item-row-desc'>";
                            elem += "<span class='item-priority'>Priority: " + ((prod[k].priority == 1) ? "<span class='red'>high</span>" : "<span class='gray'>normal</span>") + "</span>";
                            if (prod[k].unit != "" && prod[k].unit) {
                                elem += "<span class='item-qty'>Qty: <span class='gray'>" + prod[k].quantity + " " + prod[k].unit + "</span></span>";
                            } else {
                                elem += "<span class='item-qty'>Qty: <span class='gray'>" + prod[k].quantity + "</span></span>";
                            }
                            elem += "<span class='item-prize'>Prize: <span class='gray'>" + prod[k].prize + "</span></span>";
                            
                            if (prod[k].description != "" && prod[k].description) {
                                elem += "<div class='prod-description'>";
                                elem += "<span class='item-description'>Note: <span class='gray'>" + prod[k].description + "</span></span>";
                                elem += "</div>";
                            }

                            elem += "<div class='btn-edit'>";
                            elem += '<div class="alertify-button alertify-button-ok" id="addProduct"><span class="icon-file-edit"></span> Edit</div>';
                            elem += "</div>";

                            elem += "</div>";

                            elem += "</div>";

                            elements += elem;

                            countProduct++;
                        }

                        if (countProduct >= cat[i].items_done) {
                            break; 
                        }
                    }
                }

                countProduct = 0;
                elements += "</div></div>";
            }
        }

        if (uncat[check] > 0) {
            elements += "<div data-id='" + null + "' class='products-category'>";
            elements += "<h2><span class='icon-inbox left'></span>";
            elements += "<span class='products-count left'>" + uncat[check] + "</span>";
            elements += "<span class='right'>" + uncat.name + "</span></h2>";
            elements += "<div class='products-list'>";

            for (var k = 0, _length2 = prod.length; k < _length2; k++) {
                if (!dones) {
                    if (prod[k].category_id == uncat.id) {
                        var elem = "<div class='item-row' data-id='" + prod[k].id + "'>";
                            if (prod[k].buyed) {
                                elem += "<span class='item-ok icon-ok yellow'></span>";
                            } else {
                                elem += "<span class='item-ok icon-ok'></span>";
                            }
                        
                        if (prod[k].priority == 1) {
                            if (prod[k].buyed) {
                                elem += "<span class='item-name strike'><span class=' grays icon-asterisk'></span>" + prod[k].name + "</span>";
                            } else {
                                elem += "<span class='item-name'><span class='icon-asterisk'></span>" + prod[k].name + "</span>";
                            }
                        } else {
                            if (prod[k].buyed) {
                                elem += "<span class='strike item-name'>" + prod[k].name + "</span>";
                            } else {
                                elem += "<span class='item-name'>" + prod[k].name + "</span>";
                            }
                        }
                        
                        elem += "<span class='item-delete icon-remove-circle'></span>";
                        elem += "<div class='item-row-desc'>";
                        elem += "<span class='item-priority'>Priority: " + ((prod[k].priority == 1) ? "<span class='red'>high</span>" : "<span class='gray'>normal</span>") + "</span>";
                        if (prod[k].unit != "" && prod[k].unit) {
                            elem += "<span class='item-qty'>Qty: <span class='gray'>" + prod[k].quantity + " " + prod[k].unit + "</span></span>";
                        } else {
                            elem += "<span class='item-qty'>Qty: <span class='gray'>" + prod[k].quantity + "</span></span>";
                        }
                        elem += "<span class='item-prize'>Prize: <span class='gray'>" + prod[k].prize + "</span></span>";
                        
                        if (prod[k].description != "" && prod[k].description) {
                            elem += "<div class='prod-description'>";
                            elem += "<span class='item-description'>Note: <span class='gray'>" + prod[k].description + "</span></span>";
                            elem += "</div>";
                        }

                        elem += "<div class='btn-edit'>";
                        elem += '<div class="alertify-button alertify-button-ok" id="addProduct"><span class="icon-file-edit"></span> Edit</div>';
                        elem += "</div>";

                        elem += "</div>";

                        elem += "</div>";

                        elements += elem;

                        countProduct++;
                    }

                    if (countProduct >= uncat.items_all) {
                        break; 
                    }
                } else {
                    if (prod[k].category_id == uncat.id && prod[k].buyed) {
                        var elem = "<div class='item-row' data-id='" + prod[k].id + "'>";
                            elem += "<span class='item-ok icon-ok yellow'></span>";
                        
                        if (prod[k].priority == 1) {
                            elem += "<span class='item-name strike'><span class='grays icon-asterisk'></span>" + prod[k].name + "</span>";
                        } else {
                            elem += "<span class='item-name strike'>" + prod[k].name + "</span>";
                        }
                        
                        elem += "<span class='item-delete icon-remove-circle'></span>";
                        elem += "<div class='item-row-desc'>";
                        elem += "<span class='item-priority'>Priority: " + ((prod[k].priority == 1) ? "<span class='red'>high</span>" : "<span class='gray'>normal</span>") + "</span>";
                        if (prod[k].unit != "" && prod[k].unit) {
                            elem += "<span class='item-qty'>Qty: <span class='gray'>" + prod[k].quantity + " " + prod[k].unit + "</span></span>";
                        } else {
                            elem += "<span class='item-qty'>Qty: <span class='gray'>" + prod[k].quantity + "</span></span>";
                        }
                        elem += "<span class='item-prize'>Prize: <span class='gray'>" + prod[k].prize + "</span></span>";
                        
                        if (prod[k].description != "" && prod[k].description) {
                            elem += "<div class='prod-description'>";
                            elem += "<span class='item-description'>Note: <span class='gray'>" + prod[k].description + "</span></span>";
                            elem += "</div>";
                        }

                        elem += "<div class='btn-edit'>";
                        elem += '<div class="alertify-button alertify-button-ok" id="addProduct"><span class="icon-file-edit"></span> Edit</div>';
                        elem += "</div>";

                        elem += "</div>";

                        elem += "</div>";

                        elements += elem;

                        countProduct++;
                    }

                    if (countProduct >= uncat.items_done) {
                        break; 
                    }
                }
            }

            countProduct = 0;
            elements += "</div></div>";
        }

        if (shopen.isEmptyProductList(dones)) {
            elements += "<div class='empty-list'>";
            if (dones) {
                elements += "<h2>Products bought list is empty</h2>";
                elements += "<h3>Add products and buy something!</h3>";
                elements += "<div id='addProductButton'>";
                elements += "<span class='icon-inbox-alt'></span>";
                elements += "<span class='add_product_category'>Add product</span>";
                elements += "</div>";
            } else {
                elements += "<h2>Your shopping list is empty</h2>";
                elements += "<div id='addProductButton'>";
                elements += "<span class='icon-inbox-alt'></span>";
                elements += "<span class='add_product_category'>Add product</span>";
                elements += "</div>";
            }
            elements += "</div>";
        } 

        return elements;
    };

    shopen.eventsSearch = function () {
        $('#searchPanel').off('touchstart');
        $('#searchPanel').on('touchstart', function () {
            var search = $('#search'),
                container = $('#main-container');

            if (search.is(":visible")) {
                search.slideUp();
                if (search.css('top') != '55px') {
                    container.animate({ 
                        'padding-top' : 0
                    });
                }
            } else {
                search.slideDown();
                if (search.css('top') != '55px') {
                    container.animate({ 
                        'padding-top' : 120
                    });
                }
            }
        });

        $('#search input').off('keyup');
        $('#search input').on('keyup', function () {
             var filter = $(this).val();

            $(".item-name").each(function () {
                var $this = $(this),
                    grandparent = $this.parent().parent().parent();

                if ($this.text().search(new RegExp(filter, "i")) < 0) {
                    $this.parent().fadeOut();
                } else {
                    $this.parent().show();
                    if (!grandparent.is(":visible")) {
                        grandparent.show();
                    }
                }

                if ($(".item-row:visible", grandparent).length === 0) {
                    grandparent.hide(); 
                } else {
                    grandparent.show();
                }
            });
        });
    };

    shopen.eventsTopMenu = function () {
        $('#shoppingList').off('touchstart');
        $('#shoppingList').on('touchstart', function () {
            bb.pushScreen('views/mainView.html', 'mainView');
        });

        $('#buyedList').off('touchstart');
        $('#buyedList').on('touchstart', function () {
            bb.pushScreen('views/buyedView.html', 'buyedView');
        });

        $('#categoryList').off('touchstart');
        $('#categoryList').on('touchstart', function () {
            bb.pushScreen('views/categoryView.html', 'categoryView');
        });

        $('#addCategory').off('touchstart');
        $('#addCategory').on('touchstart', function () {
            bb.pushScreen('views/addCategoryView.html', 'addCategoryView');
        });

        $('#addProduct').off('touchstart');
        $('#addProduct').on('touchstart', function () {
            bb.pushScreen('views/addProductView.html', 'addProductView');
        });

        $('#options').off('touchstart');
        $('#options').on('touchstart', function () {
            bb.pushScreen('views/optionsView.html', 'optionsView');
        });

        setTimeout(function () {
            $('#main-container, #form-container').addClass('opContainer');
        }, 20);
    };

    shopen.eventsAddEditCategory = function () {
        $('#saveCategory').off('touchstart');
        $('#saveCategory').on('touchstart', function () {
            var name = $('#catName'),
                desc = $('#catDesc'),
                id_cat = $('#catId');

            if (name.val() && name.val() != "") {
                if (id_cat.length == 0) {
                    shopen.addCategory({
                        id : null,
                        name : name.val(),
                        description : desc.val(),
                        items_all: 0,
                        items_done: 0
                    });

                    bb.pushScreen('views/categoryView.html', 'categoryView', {added: true});
                } else {
                    shopen.modifyCategory(id_cat.val(), {
                        name : name.val(),
                        description : desc.val()
                    });

                    bb.pushScreen('views/categoryView.html', 'categoryView', {edited: true});
                }
            } else {
                alertify.error("Name must be not empty!");
            }
        });
    };

    shopen.eventsAddEditProduct = function () {
        $('#saveProduct').off('touchstart');
        $('#saveProduct').on('touchstart', function () {
            var name = $('#prodName'),
                cat = $('#prodCategories'),
                desc = $('#prodDesc'),
                quant = $('#prodQuantity'),
                unit = $('#prodUnits'),
                prize = $('#prodPrize'),
                prior = $('#prodPriority'),
                id_prod = $('#prodId'),
                category;

            if (name.val() && name.val() != "") {
                if (parseInt(cat.val(),10) == 0) {
                    cat = null;
                    category = shopen.base.uncategorized;
                } else {
                    cat = parseInt(cat.val(),10);
                    category = shopen.findCategory(cat).category;
                }

                if (isNaN(parseInt(quant.val(),10)) || quant.val() == "" || !quant.val()) {
                    quant = 1;
                } else {
                    quant = quant.val();
                }

                console.log("test");

                if (id_prod.length == 0) {
                    shopen.addProduct({
                        id : null,
                        category_id : cat,
                        name : name.val(),
                        description : desc.val(),
                        buyed : false,
                        priority : parseInt(prior.val(),10),
                        quantity : quant,
                        unit : unit.val(),
                        prize : prize.val()
                    });

                    category.items_all += 1; 

                    if (cat == null) {
                        shopen.modifyUncategorized({items_all: category.items_all});
                    } else {
                        shopen.modifyCategory(cat, {items_all: category.items_all});
                    }

                    bb.pushScreen('views/mainView.html', 'mainView', {added: true});
                } else {
                    var item = shopen.findProduct(parseInt(id_prod.val(),10)).product;
                    if (item.category_id == null) {
                        var category_old = shopen.base.uncategorized;
                    } else {
                        var category_old = shopen.findCategory(item.category_id).category;
                    }

                    if (item.category_id != cat) {
                        if (item.buyed) {
                            category_old.items_all -= 1;
                            category_old.items_done -= 1;

                            category.items_all += 1;
                            category.items_done += 1; 

                            if (item.category_id == null) {
                                shopen.modifyUncategorized({items_all: category_old.items_all, items_done: category_old.items_done});
                            } else {
                                shopen.modifyCategory(item.category_id, {items_all: category_old.items_all, items_done: category_old.items_done});
                            }

                            if (cat == null) {
                                shopen.modifyUncategorized({items_all: category.items_all, items_done: category.items_done});
                            } else {
                                shopen.modifyCategory(cat, {items_all: category.items_all, items_done: category.items_done});
                            }
                        } else {
                            category_old.items_all -= 1;
                            category.items_all += 1;

                            if (item.category_id == null) {
                                shopen.modifyUncategorized({items_all: category_old.items_all});
                            } else {
                                shopen.modifyCategory(item.category_id, {items_all: category_old.items_all});
                            }

                            if (cat == null) {
                                shopen.modifyUncategorized({items_all: category.items_all});
                            } else {
                                shopen.modifyCategory(cat, {items_all: category.items_all});
                            }
                        }
                    }

                    shopen.modifyProduct(parseInt(id_prod.val(),10), {
                        category_id : cat,
                        name : name.val(),
                        description : desc.val(),
                        priority : parseInt(prior.val(),10),
                        quantity : quant,
                        unit : unit.val(),
                        prize : prize.val()
                    });

                    bb.pushScreen('views/mainView.html', 'mainView', {edited: true});
                }
            } else {
                alertify.error("Name must be not empty!");
            }
        });
    };

    shopen.eventsOptions = function () {
        $('#saveOptions').off('touchstart');
        $('#saveOptions').on('touchstart', function () {
            var name = $('#defaultUncat').val(),
                landscape = document.getElementById('landscapeOptions').getChecked();

            if (name == "") {
                alertify.error("Name must be not empty!");
            } else {
                shopen.renameUncategorized(name);

                shopen.modifyOptions({
                    landscape : landscape
                });

                shopen.orientation(landscape);

                alertify.success("Options saved");
                setTimeout(function () {
                    bb.pushScreen('views/optionsView.html', 'optionsView');
                }, 1000);
            }
            
        });

        $('#clearItems').off('touchstart');
        $('#clearItems').on('touchstart', function () {
            alertify.confirm("Delete all products?", function (e) {
                if (e) {
                    shopen.clearAllProducts();
                    alertify.success("Products deleted");
                }
            });
        });

        $('#clearCategories').off('touchstart');
        $('#clearCategories').on('touchstart', function () {
            alertify.confirm("Delete all categories?", function (e) {
                if (e) {
                    shopen.clearCategories();
                    alertify.success("Categories deleted");
                }
            });
        });

        $('#clearAll').off('touchstart');
        $('#clearAll').on('touchstart', function () {
            alertify.confirm("Delete all data?", function (e) {
                if (e) {
                    shopen.clearAllData();
                    alertify.success("Application reset successful");
                    setTimeout(function () {
                        bb.pushScreen('views/optionsView.html', 'optionsView');
                    }, 1000);
                }
            });
        });
    };

    shopen.eventsCategoryList = function () {
        $('#addCategoryButton').off('touchstart');
        $('#addCategoryButton').on('touchstart', function () {
            bb.pushScreen('views/addCategoryView.html', 'addCategoryView');
        });

        $('.item-name').off('click');
        $('.item-name').on('click', function () {
            var elem = $(this).parent().find('div.item-row-desc');

            if (elem.is(':visible') && elem) {
                elem.slideUp();
            } else {
                elem.slideDown();
            }
        });

        $('.item-ok').off('touchstart');
        $('.item-ok').on('touchstart', function () {
            var id_cat = $(this).parent().data('id');

            bb.pushScreen('views/editCategoryView.html', 'editCategoryView', {id: id_cat});
        });

        $('.item-delete').off('touchstart');
        $('.item-delete').on('touchstart', function () {
            var $this = $(this).parent(),
                cat = $this,
                cat_id = cat.data("id"),
                parent = cat.parent().parent(),
                cat_count = parent.find('.products-count');

            alertify.confirm("Delete this category?", function (e) {
                if (e) {
                    var count = parseInt(cat_count.text(),10) - 1;

                    shopen.deleteCategory(cat_id);
                    shopen.uncategorizedProducts(cat_id);

                    $this.fadeOut(function () {
                        $(this).remove();
                    });

                    cat_count.text(count);

                    if (count <= 0) {
                        parent.fadeOut(function () {
                            $(this).remove();
                            bb.pushScreen('views/categoryView.html', 'categoryView');
                        });
                    }

                    alertify.success("Category deleted");
                }
            });
        });
    };

    shopen.eventsProductList = function (dones) {
        var checks = function (that, swipe) {

            if (!swipe) {
                var $this = that,
                    parent = $this.parent(),
                    prod_id = parent.data("id"),
                    brother = $this.next(),
                    child = brother.find('span'),
                    cat = parent.parent().parent(),
                    cat_count = cat.find('.products-count'),
                    cat_id = cat.data("id");
            } else {
                var $this = that.prev(),
                    parent = $this.parent(),
                    prod_id = parent.data("id"),
                    brother = that,
                    child = brother.find('span'),
                    cat = parent.parent().parent(),
                    cat_count = cat.find('.products-count'),
                    cat_id = cat.data("id");
            }

            $this.toggleClass('yellow');
            brother.toggleClass('strike');

            if (cat_id == null) {
                var item = shopen.findProduct(prod_id).product,
                    category = shopen.base.uncategorized;
            } else {
                var item = shopen.findProduct(prod_id).product,
                    category = shopen.findCategory(cat_id).category;
            }

            if ($this.hasClass("yellow")) {
                category.items_done += 1; 
                child.toggleClass('grays');
                if (cat_id == null) {
                    shopen.modifyUncategorized({items_done: category.items_done});
                } else {
                    shopen.modifyCategory(cat_id, {items_done: category.items_done});
                }
                shopen.modifyProduct(prod_id, {buyed: true});
                alertify.success("Product bought");
            } else {
                category.items_done -= 1; 
                child.toggleClass('grays');
                if (cat_id == null) {
                    shopen.modifyUncategorized({items_done: category.items_done});
                } else {
                    shopen.modifyCategory(cat_id, {items_done: category.items_done});
                }
                shopen.modifyProduct(prod_id, {buyed: false});

                if (dones) {
                    cat_count.text(category.items_done);
                    parent.fadeOut(function () {
                        $(this).remove();
                        alertify.log("Product moved to the list");
                    });

                    if (category.items_done <= 0) {
                        cat.fadeOut(function () {
                            $(this).remove();
                            if ($('.products-category').length == 0) {
                                bb.pushScreen('views/buyedView.html', 'buyedView');
                            }
                        });
                    }  
                } else {
                    alertify.log("Purchase aborted");
                }
            }
        };

        $('#addProductButton').off('touchstart');
        $('#addProductButton').on('touchstart', function () {
            bb.pushScreen('views/addProductView.html', 'addProductView');
        });

        $('.item-name').swipe({
            click: function(event, target){
                var elem = this.parent().find('div.item-row-desc');

                if (elem.is(':visible') && elem) {
                    elem.slideUp();
                } else {
                    elem.slideDown();
                }
            },
            swipeRight: function(event, direction, distance, duration, fingerCount) {
                checks(this, true);
            },
            swipeLeft: function(event, direction, distance, duration, fingerCount) {
                checks(this, true);
            },
            threshold: 30
        });

        $('.btn-edit').off('touchstart', '.alertify-button');
        $('.btn-edit').on('touchstart', '.alertify-button', function () {
            var id_prod = $(this).parent().parent().parent().data('id');

            bb.pushScreen('views/editProductView.html', 'editProductView', {id: id_prod});
        });

        $('.item-delete').off('touchstart');
        $('.item-delete').on('touchstart', function () {
            var parent = $(this).parent(),
                prod_id = parent.data("id"),
                cat = parent.parent().parent(),
                cat_id = cat.data("id"),
                cat_count = cat.find('.products-count');

            alertify.confirm("Delete product from the list?", function (e) {
                if (e) {

                    if (cat_id == null) {
                        var item = shopen.findProduct(prod_id).product,
                            category = shopen.base.uncategorized;
                    } else {
                        var item = shopen.findProduct(prod_id).product,
                            category = shopen.findCategory(cat_id).category;
                    }

                    category.items_all -= 1;    

                    if (item.buyed) {
                        if (cat_id == null) {
                            shopen.modifyUncategorized({items_all: category.items_all, items_done: category.items_done-1});
                        } else {
                            shopen.modifyCategory(cat_id, {items_all: category.items_all, items_done: category.items_done-1});
                        }
                        cat_count.text(category.items_done);
                    } else {
                        if (cat_id == null) {
                            shopen.modifyUncategorized({items_all: category.items_all});
                        } else {
                            shopen.modifyCategory(cat_id, {items_all: category.items_all});
                        }
                        cat_count.text(category.items_all);
                    }

                    shopen.deleteProduct(prod_id);

                    parent.fadeOut(function () {
                        $(this).remove();
                        alertify.success("Product deleted");
                    });

                    if (item.buyed) {
                        if (category.items_done <= 0) {
                            cat.fadeOut(function () {
                                $(this).remove();

                                if ($('.products-category').length == 0) {
                                    bb.pushScreen('views/mainView.html', 'mainView');
                                }
                            });
                        }
                    } else {
                        if (category.items_all <= 0) {
                            cat.fadeOut(function () {
                                $(this).remove();

                                if ($('.products-category').length == 0) {
                                    bb.pushScreen('views/mainView.html', 'mainView');
                                }
                            });

                        }
                    }
                }
            });
        });

        $('.item-ok').off('touchstart');
        $('.item-ok').on('touchstart', function () {
            checks($(this), false);
        });
    };

	$(document).ready(function($) {
        var elements = "";

		document.addEventListener('webworksready', function(e) {
            shopen.orientation(shopen.base.options.landscape);
            bb.init({  
              	highlightColor: '#F28705',
                onscreenready: function(element, id, params) {
                    switch(id) {
                        case 'mainView':
                            elements = shopen.createProductList();
                            break;
                        case 'buyedView':
                            elements = shopen.createProductList(true);
                            break;
                        case 'categoryView':
                            elements = shopen.createCategoriesList();
                            break;
                    }
                },
              	ondomready: function(element, id, params) {
              		switch(id) {
              			case 'mainView':
                            var container = $('#main-container');
                            container[0].innerHTML = elements;

                            // events
                            shopen.eventsTopMenu();
                            shopen.eventsSearch();
                            shopen.eventsProductList();

                            if (typeof params !== 'undefined' && params.error) {
                                alertify.alert("Database is full, please remove something before you change or add items", function () {
                                    alertify.error("No free space for new/modify items");
                                });
                            }

                            if (typeof params !== 'undefined' && params.added) {
                                alertify.success("Product added");
                            }

                            if (typeof params !== 'undefined' && params.edited) {
                                alertify.success("Product edited");
                            }
                            break;
                        case 'buyedView':
                            var container = $('#main-container');
                            container[0].innerHTML = elements;

                            // events
                            shopen.eventsTopMenu();
                            shopen.eventsSearch();
                            shopen.eventsProductList(true);
                            break;
                        case 'categoryView':
                            var container = $('#main-container');
                            container[0].innerHTML = elements;

                            // events
                            shopen.eventsTopMenu();
                            shopen.eventsSearch();
                            shopen.eventsCategoryList();

                            if (typeof params !== 'undefined' && params.added) {
                                alertify.success("Category added");
                            }

                            if (typeof params !== 'undefined' && params.edited) {
                                alertify.success("Category edited");
                            }
                            break;
                        case 'addCategoryView':

                            // events
                            shopen.eventsTopMenu();
                            shopen.eventsAddEditCategory();
                            break;
                        case 'editCategoryView':
                            if (typeof params !== 'undefined' && params.id) {
                                var category = shopen.findCategory(params.id).category;

                                $('#catName').val(category.name);
                                $('#catDesc').val(category.description);
                                $('#catId').val(category.id);
                            }
                            // events
                            shopen.eventsTopMenu();
                            shopen.eventsAddEditCategory();
                            break;
                        case 'editProductView':
                            var dropdown = document.getElementById('prodCategories'),
                                dropdown2 = document.getElementById('prodPriority'),
                                categories = shopen.base.categories, option;

                            for (var i = 0, _length = categories.length; i < _length; i++) {
                                option = document.createElement('option');
                                option.setAttribute('value',categories[i].id);
                                option.innerHTML = categories[i].name;
                                dropdown.appendChild(option);
                            }
                            dropdown.refresh();

                            if (typeof params !== 'undefined' && params.id) {
                                var item = shopen.findProduct(params.id).product;

                                $('#prodName').val(item.name);
                                $('#prodDesc').val(item.description);
                                $('#prodId').val(item.id);
                                $('#prodQuantity').val(parseInt(item.quantity,10));
                                $('#prodUnits').val(item.unit);
                                $('#prodPrize').val(item.prize);

                                dropdown2.setSelectedItem(item.priority);
                                dropdown.setSelectedItem(item.category_id);
                            }

                            // events
                            shopen.eventsTopMenu();
                            shopen.eventsAddEditProduct();
                            break;
                        case 'addProductView':
                            var dropdown = document.getElementById('prodCategories'),
                                categories = shopen.base.categories, option;

                            for (var i = 0, _length = categories.length; i < _length; i++) {
                                option = document.createElement('option');
                                option.setAttribute('value',categories[i].id);
                                option.innerHTML = categories[i].name;
                                dropdown.appendChild(option);
                            }
                            dropdown.refresh();
                            // events
                            shopen.eventsTopMenu();
                            shopen.eventsAddEditProduct();
                            break;
                        case 'optionsView':
                            var item = shopen.base.uncategorized;
                            $('#defaultUncat').val(item.name);
                            document.getElementById('landscapeOptions').setChecked(shopen.base.options.landscape);
                            // events      
                            shopen.eventsTopMenu();
                            shopen.eventsOptions();
                            break;
              		}
              	}
            });
            
            bb.pushScreen('views/mainView.html', 'mainView');
        }, false);
	});
})(this, this.document);