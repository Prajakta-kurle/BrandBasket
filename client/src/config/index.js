export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },

  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },

  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },

  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter Product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter Product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accesories", label: "Accesories" },
      { id: "footwear", label: "Footwear" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levi's" },
      { id: "zara", label: "Zara" },
      { id: "h&m", label: "H&M" },
    ]
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter original price",
  },

  {
    label: "salePrice",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock ",
  },
];

export const ShoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
    {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "men",
    label: "Men",
    path: "/shop/listing",
  },
  {
    id: "women",
    label: "Women",
    path: "/shop/listing",
  },
  {
    id: "kids",
    label: "Kids",
    path: "/shop/listing",
  },
  {
    id: "accesories",
    label: "Accesories",
    path: "/shop/listing",
  },
  {
    id: "footware",
    label: "Footwear",
    path: "/shop/listing",
  },
   {
    id: "search",
    label: "Search",
    path: "/shop/search",
  }
];

export const categoryOptionsMap = {
  'men' : 'Men',
  'women' : 'Women',
  'kids' : 'Kids',
  'accesories' : 'Accesories',
  'footwear' : 'Footwear'
}

export const brandOptionsMap = {
  'nike' : "Nike",
  'adidas' : 'Adidas',
  'puma' : 'Puma',
  "levi" : "Levi's",
   'zara' : 'Zara',
   'h&m' : 'H&M'
}

export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "accesories", label: "Accesories" },
    { id: "footwear", label: "Footwear" },
  ],
  brand: [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "levi", label: "Levi's" },
    { id: "zara", label: "Zara" },
    { id: "h&m", label: "H&M" },
  ],
};

export const sortOptions =[
    {id: 'price-lowtohigh', label: "Price: Low To High"},
    {id: 'price-hightolow', label: "Price: High To Low"},
    {id: 'title-atoz', label: "Title: A to Z"},
    {id: 'title-ztoa', label: "Title: Z to A"},
]

export const addressFormControls =[
  {
    label : "Address",
    name : "address",
    componentType : "input",
    type : "text",
    placeholder : "Enter your Adreess",
  },
  {
    label : "City",
    name : "city",
    componentType : "input",
    type : "text",
    placeholder : "Enter your City",
  },
  {
    label : "PinCode",
    name : "pincode",
    componentType : "input",
    type : "text",
    placeholder : "Enter your PinCode",
 },
  {
    label : "Phone",
    name : "phone",
    componentType : "input",
    type : "text",
    placeholder : "Enter your Phone",
 },
  {
    label : "Notes",
    name : "notes",
    componentType : "textarea",
    placeholder : "Enter your additional notes",
 },

]
