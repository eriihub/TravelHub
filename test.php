<main>
    <? echo modulo("banner_interior", array("portada" => $portada, "apartado" => $apartado)); ?>

    <section class="interiores productos catalogo">

        <? echo modulo("titulo_apartado", array("apartado" => $apartado)); ?>

        <!-- Nav tabs -->
        <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active relative">
                <a href="#cat-todos" aria-controls="todos" role="tab" data-toggle="tab" class="animacion">
                    <figcaption> </figcaption>
                    <?= TODOS ?>
                </a>
            </li>
            <? foreach ($categorias as $cont => $categoria): ?>

                <?php
                // Guarda nombre y comprueba si está vacio
                $nombreCategoria = t($categoria, 'nombre');
                if (empty(trim($nombreCategoria))) continue;
                ?>

                <li role="presentation" class="relative">
                    <a href="#cat-<?= parsea_enlace($nombreCategoria) ?>" aria-controls="<?= parsea_enlace($nombreCategoria) ?>" role="tab" data-toggle="tab" class="animacion">
                        <figcaption> </figcaption>
                        <?= t($nombreCategoria) ?>
                    </a>
                </li>
            <? endforeach; ?>
        </ul>

        <!-- Tab panes -->
        <div class="tab-content">
            <div role="tabpanel" class="tab-pane fade in active" id="cat-todos">
                <div class="contenedor-proyectos visible-lg">
                    <? $currentCol = 0; ?>
                    <? $filtros = array("0" => "azul", "1" => "negro"); ?>
                    <div class="row row-eq-height">

                        <? for ($cont = 0; $cont < count($proyectos); $cont++): ?>
                            <? $proyecto = $proyectos[$cont]; ?>
                            <? if ($currentCol >= 12): ?>
                                <? $colEspecial = false; ?>
                                <? if (@$proyectos[$cont]['tipo'] != "1" || @$proyectos[$cont + 1]['tipo'] != "1" || @$proyectos[$cont + 2]['tipo'] != "1" || @$proyectos[$cont + 3]['tipo'] != "1") {
                                    $colEspecial = true;
                                } ?>
                                <? if ($cont === 0 && ($proyectos[$cont]['tipo'] == "1" || $proyectos[$cont + 1]['tipo'] == "1")) {
                                    $colEspecial = false;
                                } ?>

                    </div>
                    <div class="row row-eq-height">
                        <? $currentCol = 0; ?>
                    <? endif; ?>
                    <? $currentCol += ($proyecto['tipo'] == "3" ? 6 : 3); ?>

                    <? if ($proyecto['tipo'] == "1"): ?>
                        <? if ($colEspecial): ?>
                            <? echo modulo("proyectos/proyecto_pequeno_2", array("ultimo" => ($currentCol >= 12), "tabla" => $tabla, "proyecto" => array($proyecto, $proyectos[$cont + 1]), "color" => array($filtros[$cont % 2], $filtros[($cont + 1) % 3]))); ?>
                            <? $cont++; ?>
                        <? else: ?>
                            <? echo modulo("proyectos/proyecto_pequeno", array("ultimo" => ($currentCol > 6), "tabla" => $tabla, "proyecto" => $proyecto, "color" => $filtros[$cont % 2])); ?>
                        <? endif; ?>
                    <? endif; ?>
                    <? if ($proyecto['tipo'] == "2"): ?>
                        <? echo modulo("proyectos/proyecto_mediano", array("ultimo" => ($currentCol >= 12), "tabla" => $tabla, "proyecto" => $proyecto, "color" => $filtros[$cont % 2])); ?>
                    <? endif; ?>
                    <? if ($proyecto['tipo'] == "3"): ?>
                        <? echo modulo("proyectos/proyecto_grande", array("ultimo" => ($currentCol >= 12), "tabla" => $tabla, "proyecto" => $proyecto, "color" => $filtros[$cont % 2])); ?>
                    <? endif; ?>
                <? endfor; ?>
                    </div>
                </div>
                <div class="contenedor-proyectos visible-md">
                    <div class="row">
                        <? for ($cont = 0; $cont < count($proyectos); $cont++): ?>
                            <? echo modulo("proyectos/proyecto_grande", array("ultimo" => ($cont % 4 == 1), "tabla" => $tabla, "proyecto" => $proyectos[$cont], "color" => $filtros[$cont % 2])); ?>
                        <? endfor; ?>
                    </div>
                </div>
                <div class="contenedor-proyectos hidden-lg hidden-md">
                    <div class="row">
                        <? for ($cont = 0; $cont < count($proyectos); $cont++): ?>
                            <? echo modulo("proyectos/proyecto_pequeno", array("ultimo" => ($cont % 4 == 1), "tabla" => $tabla, "proyecto" => $proyectos[$cont], "color" => $filtros[$cont % 2])); ?>
                        <? endfor; ?>
                    </div>
                </div>
            </div>
            <? foreach ($categorias as $cont => $categoria): ?>
                <div role="tabpanel" class="tab-pane fade in <?= ($cont < 1 ? 'active' : '') ?>"
                    id="cat-<?= parsea_enlace(t($categoria, 'nombre')) ?>">
                    <div class="contenedor-proyectos hidden-xs">
                        <div class="row">
                            <? foreach ($proyectos as $contProyecto => $proyecto): ?>


                                <? if (strpos((string) $proyecto['categoria'], "\t" . $categoria['num'] . "\t") !== false || $proyecto['categoria'] == $categoria['num']): ?>
                                    <? echo modulo("proyectos/proyecto_grande", array("ultimo" => ($contProyecto % 4 == 1), "tabla" => $tabla, "proyecto" => $proyecto, "color" => $filtros[$contProyecto % 2])); ?>


                                <? endif; ?>
                            <? endforeach; ?>
                        </div>
                    </div>
                    <div class="contenedor-proyectos visible-xs">
                        <div class="row">
                            <? foreach ($proyectos as $contProyecto => $proyecto): ?>


                                <? if (strpos((string) $proyecto['categoria'], "\t" . $categoria['num'] . "\t") !== false || $proyecto['categoria'] == $categoria['num']): ?>
                                    <? echo modulo("proyectos/proyecto_pequeno", array("ultimo" => ($contProyecto % 4 == 1), "tabla" => $tabla, "proyecto" => $proyecto, "color" => $filtros[$contProyecto % 2])); ?>


                                <? endif; ?>
                            <? endforeach; ?>
                        </div>
                    </div>
                </div>
            <? endforeach; ?>
        </div>
        <div class="clearfix"></div>
        <div class="separa-50"></div>
        <div class="separa-50"></div>

    </section>
</main>