import React from 'react';

export default function NovoProdutoPage() {
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Novo Produto</h1>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <form className="space-y-8 divide-y divide-gray-200 p-8">
          <div className="space-y-8 divide-y divide-gray-200">
            {/* Seção de informações básicas */}
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Informações Básicas</h3>
              <p className="mt-1 text-sm text-gray-500">
                Estas informações serão exibidas publicamente na sua loja.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome do produto *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="sku"
                      id="sku"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descrição
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Descreva o produto de forma clara e detalhada.
                  </p>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="mt-1">
                    <select
                      id="status"
                      name="status"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="active">Ativo</option>
                      <option value="draft">Rascunho</option>
                      <option value="out_of_stock">Sem estoque</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="featured"
                        name="featured"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="featured" className="font-medium text-gray-700">
                        Produto em destaque
                      </label>
                      <p className="text-gray-500">
                        Exibir este produto em áreas de destaque da loja.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção de preços */}
            <div className="pt-8">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Preços e Estoque</h3>
              <p className="mt-1 text-sm text-gray-500">
                Configure os preços e as opções de estoque do produto.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Preço normal *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">R$</span>
                    </div>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      min="0"
                      step="0.01"
                      required
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0,00"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700">
                    Preço promocional
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">R$</span>
                    </div>
                    <input
                      type="number"
                      name="salePrice"
                      id="salePrice"
                      min="0"
                      step="0.01"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0,00"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                    Estoque
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="stock"
                      id="stock"
                      min="0"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="trackStock"
                        name="trackStock"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="trackStock" className="font-medium text-gray-700">
                        Controlar estoque
                      </label>
                      <p className="text-gray-500">
                        Habilitar controle de estoque para este produto.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção de imagens */}
            <div className="pt-8">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Imagens do Produto</h3>
              <p className="mt-1 text-sm text-gray-500">
                Adicione imagens que mostram claramente o seu produto.
              </p>

              <div className="mt-6">
                <div className="sm:col-span-6">
                  <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                    Imagens
                  </label>
                  <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Enviar um arquivo</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">ou arraste e solte</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção de informações adicionais */}
            <div className="pt-8">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Informações Adicionais</h3>
              <p className="mt-1 text-sm text-gray-500">
                Estas informações ajudam na logística e SEO do produto.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                    Peso (kg)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="weight"
                      id="weight"
                      min="0"
                      step="0.01"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">
                    Dimensões (CxLxA em cm)
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="dimensions"
                      id="dimensions"
                      placeholder="ex: 10x5x2"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Salvar produto
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 