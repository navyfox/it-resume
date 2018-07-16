<?php

/**
 * @file
 * Contains \Drupal\api_v2\Controller\TestAPIController.
 */

namespace Drupal\api_v2\Controller;

use Drupal\Core\Controller\ControllerBase;

use Drupal\rest\ResourceResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

use Drupal\Core\Url;
use Psr\Log\LoggerInterface;

/**
 * Controller routines for test_api routes.
 */
class TestAPIController extends ControllerBase {


  /**
   * A current user instance.
   *
   * @var \Drupal\Core\Session\AccountProxyInterface
   */
  protected $currentUser;

  /**
   * Default limit entities per request.
   */
  protected $limit = 4;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
        $container->getParameter('serializer.formats'),
        $container->get('logger.factory')->get('demo_resource'),
        $container->get('current_user')
    );
  }

  /**
   * Responds to GET requests.
   */
  public function get_resume() {
//    if (!$this->currentUser->hasPermission('access content')) {
//      throw new AccessDeniedHttpException();
//    }

    $response = [
        'items' => [],
        'next_page' => FALSE,
        'prev_page' => FALSE,
    ];
    $request = \Drupal::request();
    $request_query = $request->query;
    $request_query_array = $request_query->all();
    $limit = $request_query->get('limit') ?: $this->limit;
    $page = $request_query->get('page') ?: 0;

    // Find out how many articles do we have.
    $query = \Drupal::entityQuery('node')->condition('type', 'resume');
    $articles_count = $query->count()->execute();
    $position = $limit * ($page + 1);
    if ($articles_count > $position) {
      $next_page_query = $request_query_array;
      $next_page_query['page'] = $page + 1;
      $response['next_page'] = Url::createFromRequest($request)
          ->setOption('query', $next_page_query)
          ->toString(TRUE)
          ->getGeneratedUrl();
    }

    if ($page > 0) {
      $prev_page_query = $request_query_array;
      $prev_page_query['page'] = $page - 1;
      $response['prev_page'] = Url::createFromRequest($request)
          ->setOption('query', $prev_page_query)
          ->toString(TRUE)
          ->getGeneratedUrl();
    }

    // Find articles.
    $query = \Drupal::entityQuery('node')
        ->condition('type', 'resume')
        ->sort('created', 'DESC')
        ->pager($limit);
    $result = $query->execute();
    $articles = \Drupal::entityTypeManager()
        ->getStorage('node')
        ->loadMultiple($result);

    /** @var \Drupal\node\Entity\Node $article */
    foreach ($articles as $article) {
      $response['items'][] = [
          'title' => $article->label(),
          'field_first_name' => "vfdvdf",
          'field_last_name'=> $article->field_last_name->value,
          'field_skills' => $article->field_skills->value,
      ];
    }

    return new JsonResponse($response, 200);
  }
  /**
   * Callback for `my-api/get.json` API method.
   */
  public function get_example( Request $request ) {

    $response['data'] = 'Some test data to return';
    $response['method'] = 'GET';

    return new JsonResponse( $response );
  }

  /**
   * Callback for `my-api/put.json` API method.
   */
  public function put_example( Request $request ) {

    $response['data'] = 'Some test data to return';
    $response['method'] = 'PUT';

    return new JsonResponse( $response );
  }

  /**
   * Callback for `my-api/post.json` API method.
   */
  public function post_example( Request $request ) {

    // This condition checks the `Content-type` and makes sure to 
    // decode JSON string from the request body into array.
    if ( 0 === strpos( $request->headers->get( 'Content-Type' ), 'application/json' ) ) {
      $data = json_decode( $request->getContent(), TRUE );
      $request->request->replace( is_array( $data ) ? $data : [] );
    }

    $response['data'] = 'Some test data to return';
    $response['method'] = 'POST';

    return new JsonResponse( $response );
  }

  /**
   * Callback for `my-api/delete.json` API method.
   */
  public function delete_example( Request $request ) {

    $response['data'] = 'Some test data to return';
    $response['method'] = 'DELETE';

    return new JsonResponse( $response );
  }

}
