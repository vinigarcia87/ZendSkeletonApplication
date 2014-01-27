<?php
namespace VnsCommons;

return array(
    'controllers' => array(
        'invokables' => array(
            // ...
        ),
    ),
    
    'router' => array(
        'routes' => array(
            // ...
        ),
    ),
    
    'view_helpers' => array(
        'invokables' => array(
            'textShrink'    => 'VnsCommons\View\Helper\TextShrink',
            'textToUrl'     => 'VnsCommons\View\Helper\TextToUrl',
        	'formatCpfCnpj' => 'VnsCommons\View\Helper\FormatCpfCnpj',
			'mask'			=> 'VnsCommons\View\Helper\Mask',
        ),
    ),
		
    'view_manager' => array(
        'template_path_stack' => array(
            __DIR__ . '/../view'
        ),
    ),

    'doctrine' => array(
        'driver' => array(
            __NAMESPACE__ . '_driver' => array(
                'class' => 'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                'cache' => 'array',
                'paths' => array(__DIR__ . '/../src/' . __NAMESPACE__ . '/Business/Entity'),
            ),
            'orm_default' => array(
                'drivers' => array(
                    __NAMESPACE__ . '\Entity' => __NAMESPACE__ . '_driver',
                ),
            ),
        ),
    ),

    /* ZendDeveloperTools Configuration */
    'invokables' => array(
        'VnsCommons\ConfigCollector'   => 'VnsCommons\Collector\ConfigCollector',
    ),

    'view_manager' => array(
        'template_map' => array(
            'zend-developer-tools/toolbar/vnscommons-configs' => __DIR__ . '/../view/zend-developer-tools/toolbar/vnscommons-configs.phtml',
        ),
    ),

    'zenddevelopertools' => array(
        'profiler' => array(
            'collectors' => array(
                'vnscommons_configs' => 'VnsCommons\ConfigCollector',
            ),
        ),
        'toolbar' => array(
            'entries' => array(
                'vnscommons_configs' => 'zend-developer-tools/toolbar/vnscommons-configs',
            ),
        ),
    ),
);