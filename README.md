Video 5: CannonES: (Thư viện giúp mô phỏng các va chạm, luật hấp dẫn, v.v.... giữa các thực thể) như ngoài thực tế
  - World (Gravity)
      ```javascript
        const world = new CANNON.World({
          gravity: new CANNON.Vec3(0, -9.81, 0),
        });
      ```
    
  - Body (position, material, shape, mass, ...)
      ```javascript
          const boxBody = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
            mass: 1,
            position: new CANNON.Vec3(-5, 20, 0),
            material: boxBodyMat,
          });
      ```
    
  - Material
      ```javascript
          const boxBodyMat = new CANNON.Material();
      ```
    
  - Shape (Sphere, Box(width - 1)) (trong body ở trên)


  - ContactMaterial (friction, addContactMaterial)
      ```javascript
          const groundBoxContactMat = new CANNON.ContactMaterial(
            groundBodyMat,
            boxBodyMat,
            {
              friction: 0.04,
            }
          );
    
          world.addContactMaterial(groundBoxContactMat);
          world.addContactMaterial(groundSphereContactMat);
      ```
