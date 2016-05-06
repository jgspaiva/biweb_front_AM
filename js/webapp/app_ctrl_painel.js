angular.module('biwebApp').

controller('PainelController', [ 'FontesService', 'FontesCnpjService', 'PaineisService', 'PaineisCnpjService', 'Storage', '$scope', '$cookies', function(FontesService, FontesCnpjService, PaineisService, PaineisCnpjService, Storage, $scope, $cookies){
        // Controller de Painel
        var self = this;

        self.fontes = [];
        self.fonteAtual = {};

        var graficoEscolhido = {};

        var editado = false;

        self.carregarFontes = function(){
            if($cookies.get('cnpj') != undefined && $cookies.get('cnpj') != "") self.fontes = FontesCnpjService.query({ cnpj: $cookies.get('cnpj') });
        };

        self.carregarFontes();

        self.lista = [];

        self.carregarPaineis = function(){
            if($cookies.get('cnpj') != undefined && $cookies.get('cnpj') != "") self.lista = PaineisCnpjService.query({ cnpj: $cookies.get('cnpj') });
        };

        self.carregarPaineis();

        self.novoPainel = function(){
            self.painel = {
                cnpj: $cookies.get('cnpj'),
                titulo: "",
                descricao: "",
                componentes: []
            };
        };

        self.enviar = function(){
            var processo = Math.floor((Math.random() * 1000) + 1);

            if(editado){
                PaineisService.update({ id: self.painel._id }, self.painel).$promise
                .then(
                    function(res){
                        editado = false;

                        self.novoPainel();

                        $scope.$broadcast('done', { processo: processo });

                        $('#modalForm').modal('hide');
                    },
                    function(error){
                        alert('Erro ao atualizar');

                        $scope.$broadcast('fail', { processo: processo });
                    }
                );
            }
            else {
                PaineisService.save(self.painel).$promise
                .then(
                    function(res){
                        alert(res.message);

                        self.novoPainel();

                        $scope.$broadcast('done', { processo: processo });

                        self.carregarPaineis();
                    },
                    function(error){
                        alert('Erro ao salvar');

                        $scope.$broadcast('fail', { processo: processo });
                    }
                );
            }

            return processo;
        };

        self.editar = function(painel){
            editado = true;

            self.painel = painel;
        };

        self.remover = function(painel){
            var processo = Math.floor((Math.random() * 1000) + 1);

			if(confirm('Deseja realmente excluir este painel?')){
                PaineisService.remove({ id: painel._id }).$promise
                    .then(
                    function(response){
                        $scope.$broadcast('done', { processo: processo });
                        self.lista.splice(self.lista.indexOf(painel), 1);
                    },
                    function(error){
                        $scope.$broadcast('fail', { processo: processo });
                    });
			}
            else{
                $scope.$broadcast('fail', { processo: -1 });
            }

            return processo;
        };

        self.exibir = function(painel){
            self.painelVisao = painel;

            self.painelVisao.componentes.forEach(function(componente, i){
                FontesService.get({ id: componente.fonte.id }).$promise
                .then(
                    function(response){
                        var dxComponent = $("#chartContainer" + i)[componente.dx.tipo]({
                            dataSource: response.dados,
                            title: componente.titulo,
                            series: {
                                argumentField: componente.categoria,
                                valueField: componente.valor,
                                type: componente.dx.subtipo,
                                name: componente.categoria
                            }
                        });

                        dxComponent('instance').render();

                    },
                    function(error){
                        alert("Erro");
                    });
            });

            $("#modalMaximo").modal("show");
        };

        self.grafico = function(tipo){
            graficoEscolhido.tipo = tipo;

            switch(tipo){
                case "barras":
                    graficoEscolhido.dx = {
                        tipo: "dxChart",
                        subtipo: "bar"
                    };
                    break;
                case "linhas":
                    graficoEscolhido.dx = {
                        tipo: "dxChart"
                    };
                    break;
                case "pizza":
                    graficoEscolhido.dx = {
                        tipo: "dxPieChart"
                    };
                    break;
            }
        };

        self.adicionarComponente = function(){
            var componente = {
                titulo: self.componente.titulo,
                tipo: graficoEscolhido.tipo,
                dx: graficoEscolhido.dx,
                fonte: {
                    id: self.fonteAtual._id,
                    nome: self.fonteAtual.nome
                },
                categoria: self.categoriaAtual.campo,
                valor: self.valorAtual.campo
            };

            self.painel.componentes.push(componente);

            self.componente.titulo = "";
        };

        self.removerComponente = function(index){
            self.painel.componentes.splice(index, 1);
        };

        self.categorias = function(lista){
            var saida = [];

            lista.forEach(function(item){
                if(item.tipo != "Number") saida.push(item);
            });

            return saida;
        };

        self.valores = function(lista){
            var saida = [];

            lista.forEach(function(item){
                if(item.tipo == "Number") saida.push(item);
            });

            return saida;
        };
    }]);
